import { type NextRequest } from 'next/server';

import { db } from '@/db';
import { transactionSchema } from '@/lib/validators';
import { NextResponse } from 'next/server';
import z from 'zod';
import { and, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { transactions } from '@/db/schema';
import { getActiveSubscription } from '@/lib/subscriptions/getActiveSubscription';
import { canCreateTransactions } from '@/lib/billing/can';
import { applyHistoryLimit } from '@/lib/billing/history';

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

        const subscription = await getActiveSubscription(session.user.id);

        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 401 });
        }

        const userId = session.user.id;
        const searchParams = request.nextUrl.searchParams;
        const paramsObject = Object.fromEntries(searchParams.entries());
        const filters = transactionFiltersSchema.parse(paramsObject);

        const startDate = applyHistoryLimit(subscription, filters.startDate ? new Date(filters.startDate) : undefined);

        const conditions = [eq(transactions.userId, userId)];
        if (startDate) {
            conditions.push(gte(transactions.date, startDate.toISOString().split('T')[0]));
        }
        if (filters.endDate) {
            conditions.push(lte(transactions.date, filters.endDate));
        }
        if (filters.category) {
            conditions.push(eq(transactions.category, filters.category));
        }
        if (filters.type) {
            conditions.push(eq(transactions.type, filters.type));
        }
        if (filters.search) {
            // Search in description, category, or amount
            conditions.push(
                or(
                    ilike(transactions.description, `%${filters.search}%`),
                    ilike(transactions.category, `%${filters.search}%`),
                    sql`CAST(${transactions.amount} AS TEXT) ILIKE ${`%${filters.search}%`}`,
                )!,
            );
        }

        const [{ count }] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(transactions)
            .where(and(...conditions));

        const transactionsList = await db
            .select()
            .from(transactions)
            .where(and(...conditions))
            .orderBy(desc(transactions.date), desc(transactions.createdAt))
            .limit(filters.limit)
            .offset(filters.offset);

        return NextResponse.json({
            transactions: transactionsList,
            total: count,
            limit: filters.limit,
            offset: filters.offset,
            meta: {
                historyDays: subscription.plan.features.historyDays,
            },
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
        const { transactions: transactionsList, rawInput } = transactionsInputSchema.parse(body);

        const subscription = await getActiveSubscription(userId);

        if (!subscription) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 401 });
        }

        const canAddTransactions = await canCreateTransactions(subscription, userId, transactionsList.length);

        if (!canAddTransactions) {
            return NextResponse.json(
                {
                    error: 'Monthly transaction limit reached',
                    code: 'LIMIT_REACHED',
                },
                { status: 403 },
            );
        }

        const insertedTransactions = await db.transaction(async (tx) => {
            return await tx
                .insert(transactions)
                .values(
                    transactionsList.map((t) => ({
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
