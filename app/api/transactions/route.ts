import { type NextRequest } from 'next/server';

import { db } from '@/db';
import { transaction } from '@/db/schema';
import { transactionSchema } from '@/lib/validators';
import { NextResponse } from 'next/server';
import z from 'zod';
import { and, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const transactionsInputSchema = z.object({
    transactions: z.array(transactionSchema).min(1),
    rawInput: z.string().max(1000).optional(),
});

export const transactionFiltersSchema = z.object({
    startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
    category: z.string().max(100).optional(),
    type: z.enum(['income', 'expense']).optional(),
    search: z.string().max(255).optional(),
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        const searchParams = request.nextUrl.searchParams;
        const paramsObject = Object.fromEntries(searchParams.entries());
        const filters = transactionFiltersSchema.parse(paramsObject);

        const conditions = [eq(transaction.userId, userId)];
        if (filters.startDate) {
            conditions.push(gte(transaction.date, filters.startDate));
        }
        if (filters.endDate) {
            conditions.push(lte(transaction.date, filters.endDate));
        }
        if (filters.category) {
            conditions.push(eq(transaction.category, filters.category));
        }
        if (filters.type) {
            conditions.push(eq(transaction.type, filters.type));
        }
        if (filters.search) {
            // Search in description, category, or amount
            conditions.push(
                or(
                    ilike(transaction.description, `%${filters.search}%`),
                    ilike(transaction.category, `%${filters.search}%`),
                    sql`CAST(${transaction.amount} AS TEXT) ILIKE ${`%${filters.search}%`}`,
                )!,
            );
        }

        const [{ count }] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(transaction)
            .where(and(...conditions));

        const transactions = await db
            .select()
            .from(transaction)
            .where(and(...conditions))
            .orderBy(desc(transaction.date), desc(transaction.createdAt))
            .limit(filters.limit)
            .offset(filters.offset);

        return NextResponse.json({
            transactions,
            total: count,
            limit: filters.limit,
            offset: filters.offset,
        });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        const body = await request.json();
        const { transactions, rawInput } = transactionsInputSchema.parse(body);

        const insertedTransactions = await db.transaction(async (tx) => {
            return await tx
                .insert(transaction)
                .values(
                    transactions.map((t) => ({
                        userId,
                        type: t.type,
                        amount: String(t.amount),
                        currency: t.currency,
                        category: t.category,
                        date: t.date,
                        description: t.description,
                        rawInput: rawInput,
                    })),
                )
                .returning();
        });

        return NextResponse.json({ transactions: insertedTransactions });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
