import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transaction } from '@/db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

interface BudgetItem {
    category: string;
    spent: number;
}

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        // Get current month date range
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const startDateStr = startOfMonth.toISOString().split('T')[0];
        const endDateStr = endOfMonth.toISOString().split('T')[0];

        const categoryExpenses = await db
            .select({
                category: transaction.category,
                spent: sql<number>`SUM(CAST(${transaction.amount} AS DECIMAL))::float`,
            })
            .from(transaction)
            .where(
                and(
                    eq(transaction.type, 'expense'),
                    gte(transaction.date, startDateStr),
                    lte(transaction.date, endDateStr),
                    eq(transaction.userId, userId),
                ),
            )
            .groupBy(transaction.category);

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
