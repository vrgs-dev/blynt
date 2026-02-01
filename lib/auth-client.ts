import { createAuthClient } from 'better-auth/client';

export const { signIn, signUp, signOut, useSession, getSession } = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
});
