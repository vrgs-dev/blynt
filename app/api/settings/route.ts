import { NextResponse } from 'next/server';
import { db } from '@/db';
import { settings, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';

const updateSettingsSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    currency: z.string().length(3).optional(),
    timezone: z.string().max(50).optional(),
    locale: z.string().max(10).optional(),
    notifications: z
        .object({
            tips: z.boolean(),
            reports: z.boolean(),
            updates: z.boolean(),
        })
        .optional(),
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

        // Get all settings for the user
        const userSettings = await db.select().from(settings).where(eq(settings.userId, userId));

        // Transform to key-value object
        const settingsMap: Record<string, unknown> = {};
        for (const setting of userSettings) {
            settingsMap[setting.key] = setting.value;
        }

        return NextResponse.json({
            settings: {
                currency: settingsMap.currency || 'USD',
                timezone: settingsMap.timezone || 'UTC',
                locale: settingsMap.locale || 'en',
                notifications: settingsMap.notifications || {
                    tips: false,
                    reports: false,
                    updates: false,
                },
            },
        });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const data = updateSettingsSchema.parse(body);

        await db.transaction(async (tx) => {
            // Update user name if provided
            if (data.name !== undefined) {
                await tx.update(users).set({ name: data.name }).where(eq(users.id, userId));
            }

            // Update settings
            const settingsToUpdate: { key: string; value: unknown }[] = [];

            if (data.currency !== undefined) {
                settingsToUpdate.push({ key: 'currency', value: data.currency });
            }
            if (data.timezone !== undefined) {
                settingsToUpdate.push({ key: 'timezone', value: data.timezone });
            }
            if (data.locale !== undefined) {
                settingsToUpdate.push({ key: 'locale', value: data.locale });
            }
            if (data.notifications !== undefined) {
                settingsToUpdate.push({ key: 'notifications', value: data.notifications });
            }

            // Upsert each setting
            for (const setting of settingsToUpdate) {
                const existing = await tx
                    .select()
                    .from(settings)
                    .where(and(eq(settings.userId, userId), eq(settings.key, setting.key)))
                    .limit(1);

                if (existing.length > 0) {
                    await tx
                        .update(settings)
                        .set({ value: setting.value, updatedAt: new Date() })
                        .where(and(eq(settings.userId, userId), eq(settings.key, setting.key)));
                } else {
                    await tx.insert(settings).values({
                        userId,
                        key: setting.key,
                        value: setting.value,
                    });
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
        }
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
