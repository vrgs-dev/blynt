import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const protectedRoutes = ['/dashboard'];

const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (!isProtectedRoute && !isAuthRoute) {
        return NextResponse.next();
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    // Protected routes: redirect to login if no session
    if (isProtectedRoute && !session) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && session) {
        const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
        return NextResponse.redirect(new URL(callbackUrl || '/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup', '/forgot-password', '/reset-password'],
};
