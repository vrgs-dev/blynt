import { db } from '@/db';
import { transactions } from '@/db/schema';
import { eq, gte, lte, and } from 'drizzle-orm';

export async function getMonthlyTransactionCount(userId: string, from: Date, to: Date): Promise<number> {
    const result = await db
        .select({ count: transactions.id })
        .from(transactions)
        .where(
            and(
                eq(transactions.userId, userId),
                gte(transactions.date, from.toISOString().split('T')[0]),
                lte(transactions.date, to.toISOString().split('T')[0]),
            ),
        );

    return result.length;
}
