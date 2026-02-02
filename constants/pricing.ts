interface Plan {
    name: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    cta: string;
    href: string;
    popular: boolean;
    disabled?: boolean;
}

export const plans: Plan[] = [
    {
        name: 'Free',
        description: 'See if it clicks',
        price: '$0',
        period: 'forever',
        features: [
            '50 transactions per month',
            'Natural language input',
            'Auto-categorization',
            'CSV export',
            '7-day history',
        ],
        cta: 'Start Free',
        href: '/login',
        popular: false,
    },
    {
        name: 'Pro',
        description: 'For daily trackers',
        price: '$5',
        period: 'per month',
        features: [
            'Unlimited transactions',
            'Smarter AI categorization',
            'Multi-currency support',
            'Full history',
            'Priority support',
            'Custom categories',
            'Recurring transactions',
            'AI-powered receipt parsing',
        ],
        cta: 'Go Pro',
        href: '/',
        popular: true,
    },
    {
        name: 'Team',
        description: 'Track together',
        price: '$12',
        period: 'per month',
        features: [
            'Everything in Pro',
            'Up to 5 members',
            'Shared categories',
            'Expense reports',
            'Budget tracking',
            'API access',
        ],
        cta: 'Coming Soon',
        href: '/',
        popular: false,
        disabled: true,
    },
];
