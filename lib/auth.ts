import { db } from '@/db';
import { plans, settings, subscriptions } from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { and, eq } from 'drizzle-orm';
import { addDays } from 'date-fns';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: process.env.NODE_ENV === 'production',
        sendResetPassword: async ({ user, url }) => {
            console.log(`[Password Reset] Send to ${user.email}: ${url}`);

            // TODO: Replace with actual email sending
            // await sendEmail({
            //     to: user.email,
            //     subject: 'Reset your Blynt password',
            //     html: `
            //         <h1>Reset your password</h1>
            //         <p>Click the link below to reset your password:</p>
            //         <a href="${url}">Reset Password</a>
            //         <p>This link expires in 1 hour.</p>
            //     `,
            // });
        },
    },
    plugins: [nextCookies()],
    advanced: {
        cookiePrefix: 'blynt',
        cookies: {
            session: {
                name: 'blynt_session',
                attributes: {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                },
            },
        },
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                default: 'customer',
                input: false,
            },
            disabled: {
                type: 'boolean',
                default: false,
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user, ctx) => {
                    await db.transaction(async (tx) => {
                        const setting: (typeof settings.$inferInsert)[] = [
                            { userId: user.id, key: 'currency', value: 'USD' },
                            { userId: user.id, key: 'timezone', value: 'UTC' },
                            { userId: user.id, key: 'locale', value: 'en' },
                            {
                                userId: user.id,
                                key: 'notifications',
                                value: {
                                    tips: false,
                                    reports: false,
                                    updates: false,
                                },
                            },
                        ];

                        await tx.insert(settings).values(setting);

                        const hasTrial = ctx?.request?.headers.get('x-blynt-trial') === 'true';
                        const now = new Date();
                        if (hasTrial) {
                            const [proPlan] = await tx
                                .select()
                                .from(plans)
                                .where(
                                    and(eq(plans.tier, 'pro'), eq(plans.isActive, true), eq(plans.interval, 'monthly')),
                                )
                                .limit(1);

                            if (!proPlan) {
                                throw new Error('No active monthly plan found');
                            }

                            await tx.insert(subscriptions).values({
                                userId: user.id,
                                planId: proPlan.id,
                                status: 'trial',
                                currentPeriodStart: now,
                                currentPeriodEnd: addDays(now, 7), // 7 days trial
                            });
                        }

                        const [freePlan] = await tx
                            .select()
                            .from(plans)
                            .where(and(eq(plans.tier, 'free'), eq(plans.isActive, true), eq(plans.interval, 'monthly')))
                            .limit(1);

                        if (!freePlan) {
                            throw new Error('No active monthly plan found');
                        }

                        await tx.insert(subscriptions).values({
                            userId: user.id,
                            planId: freePlan.id,
                            status: 'active',
                            currentPeriodStart: now,
                            currentPeriodEnd: addDays(now, 365 * 100), // infinite
                        });
                    });
                },
            },
        },
    },
});
