'use client';

import { QueryProvider } from '@/providers/query-provider';
import Header from './_components/header/header';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryProvider>
            <main className='grid grid-rows-[auto_1fr] bg-background mx-auto max-w-7xl h-dvh'>
                <Header />
                {children}
            </main>
        </QueryProvider>
    );
}
