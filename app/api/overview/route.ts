import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transaction } from '@/db/schema';
import { and, gte, lte, sql } from 'drizzle-orm';

interface Stats {
    balance: { value: string; change: string; isPositive: boolean };
    income: { value: string; change: string; isPositive: boolean };
    expenses: { value: string; change: string; isPositive: boolean };
    savings: { value: string; change: string; isPositive: boolean };
}

export async function GET() {
    try {
        const now = new Date();

        // Current month range
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Previous month range
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const currentStartStr = currentMonthStart.toISOString().split('T')[0];
        const currentEndStr = currentMonthEnd.toISOString().split('T')[0];
        const previousStartStr = previousMonthStart.toISOString().split('T')[0];
        const previousEndStr = previousMonthEnd.toISOString().split('T')[0];

        // Get current month totals
        const [currentStats] = await db
            .select({
                totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'income' THEN CAST(${transaction.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
                totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'expense' THEN CAST(${transaction.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
            })
            .from(transaction)
            .where(and(gte(transaction.date, currentStartStr), lte(transaction.date, currentEndStr)));

        // Get previous month totals
        const [previousStats] = await db
            .select({
                totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'income' THEN CAST(${transaction.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
                totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'expense' THEN CAST(${transaction.amount} AS DECIMAL) ELSE 0 END), 0)::float`,
            })
            .from(transaction)
            .where(and(gte(transaction.date, previousStartStr), lte(transaction.date, previousEndStr)));

        // Calculate values
        const currentIncome = currentStats.totalIncome || 0;
        const currentExpenses = currentStats.totalExpenses || 0;
        const currentBalance = currentIncome - currentExpenses;
        const currentSavings = currentIncome - currentExpenses;

        const previousIncome = previousStats.totalIncome || 0;
        const previousExpenses = previousStats.totalExpenses || 0;
        const previousBalance = previousIncome - previousExpenses;
        const previousSavings = previousIncome - previousExpenses;

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

        const savingsChange =
            previousSavings !== 0
                ? ((currentSavings - previousSavings) / Math.abs(previousSavings)) * 100
                : currentSavings > 0
                  ? 100
                  : 0;

        const stats: Stats = {
            balance: {
                value: `$${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: `${balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(1)}%`,
                isPositive: balanceChange >= 0,
            },
            income: {
                value: `$${currentIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}%`,
                isPositive: incomeChange >= 0,
            },
            expenses: {
                value: `$${currentExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: `${expensesChange >= 0 ? '+' : ''}${expensesChange.toFixed(1)}%`,
                isPositive: expensesChange < 0, // Less expenses is positive
            },
            savings: {
                value: `$${currentSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                change: `${savingsChange >= 0 ? '+' : ''}${savingsChange.toFixed(1)}%`,
                isPositive: savingsChange >= 0,
            },
        };

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
