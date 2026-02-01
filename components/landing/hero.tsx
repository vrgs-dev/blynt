'use client';

import Link from 'next/link';
import * as motion from 'motion/react-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon } from '@/components/icons';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export function Hero() {
    return (
        <section className='relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-28'>
            {/* Background decoration */}
            <div className='pointer-events-none absolute inset-0 -z-10' aria-hidden='true'>
                <motion.div
                    className='absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96'
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl sm:h-96 sm:w-96'
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 0.6, 0.5],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                    }}
                />
            </div>

            <motion.div
                className='mx-auto max-w-4xl text-center'
                variants={staggerContainer}
                initial='hidden'
                animate='visible'
            >
                <motion.div variants={fadeInUp}>
                    <Badge className='mb-4 border-2 border-primary/20 bg-primary/10 text-primary sm:mb-6'>
                        No spreadsheets required
                    </Badge>
                </motion.div>

                <motion.h1
                    className='text-balance text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl'
                    variants={fadeInUp}
                >
                    Stop logging expenses.{' '}
                    <span className='relative inline-block'>
                        <span className='relative z-10 text-primary'>Start writing them.</span>
                        <motion.span
                            className='absolute -bottom-1 left-0 right-0 h-3 -skew-x-3 bg-primary/20 sm:-bottom-2 sm:h-4'
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                            style={{ originX: 0 }}
                            aria-hidden='true'
                        />
                    </span>
                </motion.h1>

                <motion.p
                    className='mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:mt-6 sm:text-lg lg:text-xl'
                    variants={fadeInUp}
                >
                    Type <span className='font-semibold text-foreground'>&quot;coffee $4.50&quot;</span> and you&apos;re
                    done. No dropdowns, no categories to pick, no forms to fill. Our AI figures out the rest.
                </motion.p>

                <motion.div
                    className='mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4'
                    variants={fadeInUp}
                >
                    <Button
                        asChild
                        size='lg'
                        className='w-full shadow-[3px_3px_0px_0px] shadow-foreground/20 sm:w-auto'
                    >
                        <Link href='/login'>
                            Try It Free
                            <ArrowRightIcon />
                        </Link>
                    </Button>
                    <Button asChild variant='outline' size='lg' className='w-full sm:w-auto'>
                        <Link href='#how-it-works'>See How It Works</Link>
                    </Button>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <DemoCard />
                </motion.div>
            </motion.div>
        </section>
    );
}

function DemoCard() {
    return (
        <div className='mx-auto mt-10 max-w-md sm:mt-14'>
            <motion.div
                className='relative'
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <div className='overflow-hidden rounded-2xl border-2 border-border bg-card p-4 shadow-[4px_4px_0px_0px] shadow-foreground/10'>
                    <p className='text-left text-sm text-muted-foreground'>You type:</p>
                    <p className='mt-2 text-left font-mono text-sm sm:text-base'>
                        <span className='text-foreground'>Lunch with Sarah </span>
                        <span className='font-bold text-accent'>$32</span>
                        <span className='text-foreground'> split the bill</span>
                        <motion.span
                            className='inline-block h-5 w-0.5 bg-foreground'
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            aria-hidden='true'
                        />
                    </p>
                    <div className='mt-4 flex flex-wrap gap-2 border-t pt-4'>
                        <p className='mb-1 w-full text-left text-xs text-muted-foreground'>We get:</p>
                        <motion.span
                            className='inline-flex items-center gap-1.5 rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <span className='size-1.5 rounded-full bg-accent' aria-hidden='true' />
                            $32.00
                        </motion.span>
                        <motion.span
                            className='inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.95 }}
                        >
                            <span className='size-1.5 rounded-full bg-primary' aria-hidden='true' />
                            Food & Dining
                        </motion.span>
                        <motion.span
                            className='inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1 }}
                        >
                            <span className='size-1.5 rounded-full bg-muted-foreground' aria-hidden='true' />
                            Today
                        </motion.span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
