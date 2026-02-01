import { db } from '@/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: process.env.NODE_ENV === 'production',
    },
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
});
