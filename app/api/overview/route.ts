import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getActiveSubscription } from '@/lib/subscriptions/getActiveSubscription';
import { applyHistoryLimit } from '@/lib/billing/history';
import { subDays } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

interface Stats {
    balance: { value: string; change: string; isPositive: boolean };
    income: { value: string; change: string; isPositive: boolean };
    expenses: { value: string; change: string; isPositive: boolean };
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

        // Use provided dates or default to current/previous month
        let currentStartStr: string;
        let currentEndStr: string;
        let previousStartStr: string;
        let previousEndStr: string;

        if (startDateParam && endDateParam) {
            // User selected a custom range - apply history limit
            currentStartStr = limitedStartDate ? limitedStartDate.toISOString().split('T')[0] : startDateParam;
            currentEndStr = endDateParam;

            // Calculate previous period of same length
            const start = new Date(currentStartStr);
            const end = new Date(endDateParam);
            const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            const previousStart = new Date(start);
            previousStart.setDate(previousStart.getDate() - daysDiff - 1);
            const previousEnd = new Date(start);
            previousEnd.setDate(previousEnd.getDate() - 1);

            previousStartStr = previousStart.toISOString().split('T')[0];
            previousEndStr = previousEnd.toISOString().split('T')[0];
        } else {
            // Default to history limit range
            currentStartStr = limitedStartDate
                ? limitedStartDate.toISOString().split('T')[0]
                : subDays(now, 30).toISOString().split('T')[0];
            currentEndStr = now.toISOString().split('T')[0];

            // Calculate previous period of same length
            const start = new Date(currentStartStr);
            const daysDiff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            const previousStart = new Date(start);
            previousStart.setDate(previousStart.getDate() - daysDiff - 1);
            const previousEnd = new Date(start);
            previousEnd.setDate(previousEnd.getDate() - 1);

            previousStartStr = previousStart.toISOString().split('T')[0];
            previousEndStr = previousEnd.toISOString().split('T')[0];
        }

        const [currentStats] = await db
            .select({
                totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
                totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
            })
            .from(transactions)
            .where(
                and(
                    gte(transactions.date, currentStartStr),
                    lte(transactions.date, currentEndStr),
                    eq(transactions.userId, userId),
                ),
            );

        // Get previous month totals
        const [previousStats] = await db
            .select({
                totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
                totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN CAST(${transactions.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
            })
            .from(transactions)
            .where(
                and(
                    gte(transactions.date, previousStartStr),
                    lte(transactions.date, previousEndStr),
                    eq(transactions.userId, userId),
                ),
            );

        const currentIncome = currentStats.totalIncome || 0;
        const currentExpenses = currentStats.totalExpenses || 0;
        const currentBalance = currentIncome - currentExpenses;

        const previousIncome = previousStats.totalIncome || 0;
        const previousExpenses = previousStats.totalExpenses || 0;
        const previousBalance = previousIncome - previousExpenses;

        // Calculate percentage changes
        const balanceChange =
            previousBalance !== 0
                ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100
                : currentBalance > 0
                  ? 100
                  : 0;

        const incomeChange =
            previousIncome !== 0
                ? ((currentIncome - previousIncome) / previousIncome) * 100
                : currentIncome > 0
                  ? 100
                  : 0;

        const expensesChange =
            previousExpenses !== 0
                ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
                : currentExpenses > 0
                  ? 100
                  : 0;

        const stats: Stats = {
            balance: {
                value: `$${formatCurrency(currentBalance)}`,
                change: `${balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(1)}%`,
                isPositive: balanceChange >= 0,
            },
            income: {
                value: `$${formatCurrency(currentIncome)}`,
                change: `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}%`,
                isPositive: incomeChange >= 0,
            },
            expenses: {
                value: `$${formatCurrency(currentExpenses)}`,
                change: `${expensesChange >= 0 ? '+' : ''}${expensesChange.toFixed(1)}%`,
                isPositive: expensesChange < 0, // Less expenses is positive
            },
        };

        // Check if the requested range was limited
        const wasLimited = startDateParam && limitedStartDate && new Date(startDateParam) < limitedStartDate;
        const requestedDays =
            startDateParam && endDateParam
                ? Math.ceil(
                      (new Date(endDateParam).getTime() - new Date(startDateParam).getTime()) / (1000 * 60 * 60 * 24),
                  )
                : null;

        return NextResponse.json({
            stats,
            meta: {
                historyDays: subscription.plan.features.historyDays,
                wasLimited,
                requestedDays,
                appliedStartDate: currentStartStr,
            },
        });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
