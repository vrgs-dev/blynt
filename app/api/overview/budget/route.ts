import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transaction } from '@/db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';

interface BudgetItem {
    category: string;
    spent: number;
    limit: number;
}

export async function GET() {
    try {
        // Get current month date range
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const startDateStr = startOfMonth.toISOString().split('T')[0];
        const endDateStr = endOfMonth.toISOString().split('T')[0];

        // Query to get expenses grouped by category for current month
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
                ),
            )
            .groupBy(transaction.category);

        // Build budgets array - no limits, just category totals
        const budgets: BudgetItem[] = categoryExpenses.map((expense) => ({
            category: expense.category,
            spent: Math.round(expense.spent * 100) / 100, // Round to 2 decimals
            limit: 0, // No limit - will be shown as total only
        }));

        // Sort by spent amount (highest first)
        budgets.sort((a, b) => b.spent - a.spent);

        return NextResponse.json({ budgets });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
