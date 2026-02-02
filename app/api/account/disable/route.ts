import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';

const disableAccountSchema = z.object({
    confirmation: z.literal('DISABLE'),
});

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const [user] = await db.select({ disabled: users.disabled }).from(users).where(eq(users.id, userId)).limit(1);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: user.disabled });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();

        // Validate confirmation
        const result = disableAccountSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Please type DISABLE to confirm account deletion' }, { status: 400 });
        }

        await db.transaction(async (tx) => {
            // Disable the user account (soft delete)
            await tx
                .update(users)
                .set({
                    disabled: true,
                    updatedAt: new Date(),
                })
                .where(eq(users.id, userId));

            // Invalidate all sessions for this user
            await tx.delete(sessions).where(eq(sessions.userId, userId));
        });

        return NextResponse.json({
            success: true,
            message: 'Account has been disabled. You will be logged out.',
        });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
