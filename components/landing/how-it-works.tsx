'use client';

import * as motion from 'motion/react-client';

const steps = [
    {
        step: '01',
        title: 'Write it down',
        description: 'Type like you text a friend. "uber to airport $45" or "got paid 2k from freelance gig"',
        example: '"Netflix subscription $15.99"',
    },
    {
        step: '02',
        title: 'AI does the work',
        description: 'Amount, category, date, merchant — extracted instantly. No manual tagging needed.',
        example: '$15.99 → Entertainment → Netflix → Monthly',
    },
    {
        step: '03',
        title: 'See the big picture',
        description: 'Watch your spending habits unfold. Spot trends. Know exactly where your money goes.',
        example: 'Charts, exports, insights',
    },
];

export function HowItWorks() {
    return (
        <section id='how-it-works' className='border-y bg-muted/30 px-4 py-16 sm:px-6 sm:py-24'>
            <div className='mx-auto max-w-6xl'>
                <motion.div
                    className='text-center'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                        Expense tracking in 10 seconds
                    </h2>
                    <p className='mx-auto mt-3 max-w-2xl text-muted-foreground sm:mt-4 sm:text-lg'>
                        Faster than opening a spreadsheet. Seriously.
                    </p>
                </motion.div>

                <div className='mt-12 grid gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-3'>
                    {steps.map((item, index) => (
                        <StepCard key={item.step} item={item} index={index} isLast={index === steps.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface StepCardProps {
    item: {
        step: string;
        title: string;
        description: string;
        example: string;
    };
    index: number;
    isLast: boolean;
}

function StepCard({ item, index, isLast }: StepCardProps) {
    return (
        <motion.div
            className='group relative rounded-2xl border-2 border-border bg-card p-6 shadow-[4px_4px_0px_0px] shadow-foreground/10 sm:p-8'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{
                x: -2,
                y: -2,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.1)',
            }}
        >
            <div className='flex items-center gap-4'>
                <motion.span
                    className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-mono text-lg font-bold text-primary-foreground'
                    whileHover={{ scale: 1.05, rotate: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    {item.step}
                </motion.span>
                <h3 className='text-lg font-bold sm:text-xl'>{item.title}</h3>
            </div>
            <p className='mt-4 text-muted-foreground'>{item.description}</p>
            <div className='mt-4 rounded-lg bg-muted/50 px-3 py-2'>
                <p className='font-mono text-sm text-foreground'>{item.example}</p>
            </div>
            {!isLast && (
                <motion.div
                    className='absolute -right-4 top-1/2 hidden -translate-y-1/2 text-2xl text-muted-foreground lg:block'
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.15 }}
                    aria-hidden='true'
                >
                    →
                </motion.div>
            )}
        </motion.div>
    );
}
