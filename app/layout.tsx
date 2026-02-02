import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from 'sonner';

const geist = Geist({ subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], display: 'swap' });

const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://blynt.app';

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Blynt - AI-Powered Expense Tracker',
        template: '%s | Blynt',
    },
    description:
        'Track expenses and income with natural language. No forms, no categories. Just write "spent $50 on lunch" and we handle the rest. AI-powered personal finance made simple.',
    keywords: [
        'AI expense tracker',
        'personal finance app',
        'natural language expense tracking',
        'track expenses with AI',
        'budgeting app',
        'income and expense tracker',
        'expense tracker app',
        'money tracker',
        'spending tracker',
        'budget planner',
        'financial tracking app',
        'smart expense tracker',
        'automatic expense categorization',
        'expense management app',
    ],
    authors: [{ name: 'Camilo Vargas' }],
    creator: 'Blynt',
    publisher: 'Blynt',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://blynt.app',
        siteName: 'Blynt',
        title: 'Blynt - AI-Powered Expense Tracker',
        description:
            'Track expenses and income with natural language. No forms, no categories. Just write and let AI handle the rest.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Blynt - AI-Powered Expense Tracker',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blynt - AI-Powered Expense Tracker',
        description:
            'Track expenses with natural language. No forms, no categories. Just write and let AI handle the rest.',
        creator: '@vrgs_0',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Blynt - AI-Powered Expense Tracker',
            },
        ],
    },
    alternates: {
        canonical: 'https://blynt.app',
    },
    category: 'Finance',
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    verification: {
        google: '26155StCvnVzOsppkPXKrGQu17Y8bYmtp38Tu6726to',
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            '@id': 'https://blynt.app/#website',
            url: 'https://blynt.app',
            name: 'Blynt',
            description: 'AI-Powered Expense Tracker',
            publisher: {
                '@id': 'https://blynt.app/#organization',
            },
            potentialAction: {
                '@type': 'SearchAction',
                target: 'https://blynt.app/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
            },
        },
        {
            '@type': 'Organization',
            '@id': 'https://blynt.app/#organization',
            name: 'Blynt',
            url: 'https://blynt.app',
            logo: {
                '@type': 'ImageObject',
                url: 'https://blynt.app/icon-512.png',
                width: 512,
                height: 512,
            },
            sameAs: ['https://x.com/vrgs_0'],
            founder: {
                '@type': 'Person',
                name: 'Camilo Vargas',
                url: 'https://x.com/vrgs_0',
            },
        },
        {
            '@type': 'SoftwareApplication',
            '@id': 'https://blynt.app/#software',
            name: 'Blynt',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
                '@type': 'AggregateOffer',
                lowPrice: '0',
                highPrice: '12',
                priceCurrency: 'USD',
                offerCount: '3',
                offers: [
                    {
                        '@type': 'Offer',
                        name: 'Free',
                        price: '0',
                        priceCurrency: 'USD',
                    },
                    {
                        '@type': 'Offer',
                        name: 'Pro',
                        price: '5',
                        priceCurrency: 'USD',
                        priceSpecification: {
                            '@type': 'UnitPriceSpecification',
                            price: '5',
                            priceCurrency: 'USD',
                            billingDuration: 'P1M',
                        },
                    },
                ],
            },
            description:
                'AI-powered expense tracker that uses natural language to track your income and expenses. No forms, no categories.',
            featureList: [
                'Natural language input',
                'AI-powered categorization',
                'Multi-currency support',
                'CSV export',
                'Privacy-first design',
            ],
            screenshot: 'https://blynt.app/og-image.png',
        },
        {
            '@type': 'FAQPage',
            '@id': 'https://blynt.app/#faq',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'How does Blynt track expenses?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Simply type your expense in natural language, like "Spent $50 on lunch" or "Got paid 2000 from client". Our AI automatically extracts the amount, category, and date.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Is Blynt free to use?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! Blynt offers a free tier with 50 transactions per month. Pro plans start at $5/month for unlimited transactions.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'What languages does Blynt support?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Blynt currently supports English and Spanish, with automatic language detection. More languages coming soon.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Is my financial data safe with Blynt?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Absolutely. We process your input and delete it immediately. We never store, sell, or share your financial data with third parties.',
                    },
                },
            ],
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryProvider>
            <html lang='en'>
                <head>
                    <script
                        type='application/ld+json'
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                </head>
                <body className={cn('font-sans antialiased', geist.className, geistMono.className)}>
                    {children}
                    <Toaster />
                </body>
            </html>
        </QueryProvider>
    );
}
