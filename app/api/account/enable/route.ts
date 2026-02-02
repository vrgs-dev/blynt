import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const enableAccountSchema = z.object({
    confirmation: z.literal('REACTIVATE'),
});

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const result = enableAccountSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Please type REACTIVATE to confirm account reactivation' },
                { status: 400 },
            );
        }

        await db.update(users).set({ disabled: false }).where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true, message: 'Account has been reactivated' });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
