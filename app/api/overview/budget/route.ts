import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getActiveSubscription } from '@/lib/subscriptions/getActiveSubscription';
import { applyHistoryLimit } from '@/lib/billing/history';
import { subDays } from 'date-fns';

interface BudgetItem {
    category: string;
    spent: number;
}

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        // Get active subscription
        const subscription = await getActiveSubscription(userId);
        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 401 });
        }

        // Get query parameters for date range
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        const now = new Date();

        // Apply history limit based on subscription plan
        const requestedStartDate = startDateParam
            ? new Date(startDateParam)
            : subDays(now, subscription.plan.features.historyDays);
        const limitedStartDate = applyHistoryLimit(subscription, requestedStartDate);

        let startDateStr: string;
        let endDateStr: string;

        if (startDateParam && endDateParam) {
            // Use custom date range - apply history limit
            startDateStr = limitedStartDate ? limitedStartDate.toISOString().split('T')[0] : startDateParam;
            endDateStr = endDateParam;
        } else {
            // Default to history limit range
            startDateStr = limitedStartDate
                ? limitedStartDate.toISOString().split('T')[0]
                : subDays(now, 30).toISOString().split('T')[0];
            endDateStr = now.toISOString().split('T')[0];
        }

        const categoryExpenses = await db
            .select({
                category: transactions.category,
                spent: sql<number>`SUM(CAST(${transactions.amount} AS DECIMAL))::float`,
            })
            .from(transactions)
            .where(
                and(
                    eq(transactions.type, 'expense'),
                    gte(transactions.date, startDateStr),
                    lte(transactions.date, endDateStr),
                    eq(transactions.userId, userId),
                ),
            )
            .groupBy(transactions.category);

        // Build budgets array - no limits, just category totals
        const budgets: BudgetItem[] = categoryExpenses.map((expense) => ({
            category: expense.category,
            spent: Math.round(expense.spent * 100) / 100,
        }));

        // Sort by spent amount (highest first)
        budgets.sort((a, b) => b.spent - a.spent);

        return NextResponse.json({ budgets });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
