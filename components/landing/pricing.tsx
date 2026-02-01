'use client';

import Link from 'next/link';
import * as motion from 'motion/react-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/icons';

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

const plans: Plan[] = [
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

export function Pricing() {
    return (
        <section id='pricing' className='bg-muted/30 px-4 sm:px-6 py-16 sm:py-24 border-t'>
            <div className='mx-auto max-w-6xl'>
                <motion.div
                    className='text-center'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge className='bg-primary/10 mb-4 border-2 border-primary/20 text-primary'>Pricing</Badge>
                    <h2 className='font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight'>
                        Less than a coffee per month
                    </h2>
                    <p className='mx-auto mt-3 sm:mt-4 max-w-2xl text-muted-foreground sm:text-lg'>
                        Free forever, or upgrade when you&apos;re hooked
                    </p>
                </motion.div>

                <div className='gap-6 lg:gap-8 grid lg:grid-cols-3 mt-12 sm:mt-16'>
                    {plans.map((plan, index) => (
                        <PricingCard key={plan.name} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingCard({ plan, index }: { plan: Plan; index: number }) {
    return (
        <motion.div
            className={`relative flex flex-col rounded-2xl border-2 bg-card p-6 sm:p-8 ${
                plan.popular
                    ? 'border-primary shadow-[6px_6px_0px_0px] shadow-primary/30'
                    : 'border-border shadow-[4px_4px_0px_0px] shadow-foreground/10'
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={
                plan.popular
                    ? { y: -8, boxShadow: '8px 8px 0px 0px rgba(0,197,158,0.3)' }
                    : { y: -4, boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.1)' }
            }
        >
            {plan.popular && (
                <motion.div
                    className='-top-3 left-1/2 absolute -translate-x-1/2'
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: 'spring' }}
                >
                    <Badge className='bg-primary shadow-sm border-2 border-primary text-primary-foreground'>
                        Most Popular
                    </Badge>
                </motion.div>
            )}

            <div className='text-center'>
                <h3 className='font-bold text-xl'>{plan.name}</h3>
                <p className='mt-1 text-muted-foreground text-sm'>{plan.description}</p>
                <div className='mt-4'>
                    <motion.span
                        className='font-black text-4xl tracking-tight'
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                    >
                        {plan.price}
                    </motion.span>
                    <span className='ml-1 text-muted-foreground'>/{plan.period}</span>
                </div>
            </div>

            <ul className='flex-1 space-y-3 mt-6' role='list'>
                {plan.features.map((feature, featureIndex) => (
                    <motion.li
                        key={feature}
                        className='flex items-start gap-2'
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + featureIndex * 0.05 }}
                    >
                        <CheckIcon />
                        <span className='text-sm'>{feature}</span>
                    </motion.li>
                ))}
            </ul>

            <div className='mt-8'>
                <Button
                    asChild={!plan.disabled}
                    variant={plan.popular ? 'default' : 'outline'}
                    className='w-full'
                    disabled={plan.disabled}
                >
                    {plan.disabled ? <span>{plan.cta}</span> : <Link href={plan.href}>{plan.cta}</Link>}
                </Button>
            </div>
        </motion.div>
    );
}
