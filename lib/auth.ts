import { db } from '@/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

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
});
