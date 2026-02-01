import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { transaction } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { transactionSchema } from '@/lib/validators';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        const { id } = await params;
        const body = await request.json();

        const validatedData = transactionSchema.parse(body);

        const [updatedTransaction] = await db
            .update(transaction)
            .set({
                type: validatedData.type,
                amount: String(validatedData.amount),
                currency: validatedData.currency,
                category: validatedData.category,
                date: validatedData.date,
                description: validatedData.description,
            })
            .where(and(eq(transaction.id, id), eq(transaction.userId, userId)))
            .returning();

        if (!updatedTransaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({ transaction: updatedTransaction });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        const { id } = await params;
        const [deletedTransaction] = await db
            .delete(transaction)
            .where(and(eq(transaction.id, id), eq(transaction.userId, userId)))
            .returning();

        if (!deletedTransaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
