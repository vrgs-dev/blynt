'use client';

import type { ReactNode } from 'react';
import * as motion from 'motion/react-client';
import { Badge } from '@/components/ui/badge';
import { ChatIcon, LightbulbIcon, CurrencyIcon, LockIcon } from '@/components/icons';

interface Feature {
    icon: ReactNode;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: <ChatIcon />,
        title: "Type, don't tap",
        description: 'Forget clunky forms. Write "coffee $5" or "salary 3000" — done in 2 seconds flat.',
    },
    {
        icon: <LightbulbIcon />,
        title: 'Smart categorization',
        description:
            'Our AI knows "Uber" is transport and "Spotify" is entertainment. You never pick from a dropdown again.',
    },
    {
        icon: <CurrencyIcon />,
        title: 'Any currency, anywhere',
        description:
            'Traveling? Working abroad? Log expenses in euros, pesos, or yen. See totals in your home currency.',
    },
    {
        icon: <LockIcon />,
        title: 'Your data stays yours',
        description:
            'We process and forget. No selling to advertisers, no data mining. Your finances are your business.',
    },
];

export function Features() {
    return (
        <section id='features' className='px-4 py-16 sm:px-6 sm:py-24'>
            <div className='mx-auto max-w-6xl'>
                <motion.div
                    className='text-center'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <Badge className='mb-4 border-2 border-accent/20 bg-accent/10 text-accent'>Features</Badge>
                    <h2 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                        Built for people who hate expense tracking
                    </h2>
                    <p className='mx-auto mt-3 max-w-2xl text-muted-foreground sm:mt-4 sm:text-lg'>
                        We removed everything annoying about logging expenses. What&apos;s left just works.
                    </p>
                </motion.div>

                <div className='mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:gap-8'>
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
    return (
        <motion.div
            className='group flex gap-4 rounded-2xl border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px] shadow-foreground/10'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                x: -2,
                y: -2,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.1)',
            }}
        >
            <motion.div
                className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground'
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
                {feature.icon}
            </motion.div>
            <div>
                <h3 className='text-lg font-bold'>{feature.title}</h3>
                <p className='mt-2 text-muted-foreground'>{feature.description}</p>
            </div>
        </motion.div>
    );
}
