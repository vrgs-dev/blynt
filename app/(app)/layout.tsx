'use client';

import Header from './_components/header/header';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className='grid h-dvh grid-rows-[auto_1fr] bg-background max-w-7xl mx-auto'>
            <Header />
            {children}
        </main>
    );
}
