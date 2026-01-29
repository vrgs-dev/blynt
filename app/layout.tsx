import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], display: 'swap' });

const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Blynt - AI-Powered Expense Tracker',
        template: '%s | Blynt',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <head></head>
            <body className={cn('font-sans antialiased', geist.className, geistMono.className)}>{children}</body>
        </html>
    );
}
