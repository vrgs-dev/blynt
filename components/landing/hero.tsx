'use client';

import Link from 'next/link';
import * as motion from 'motion/react-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon } from '@/components/icons';
import { fadeInUp, staggerContainer } from '../animations';

export function Hero() {
    return (
        <section className='relative px-4 sm:px-6 pt-12 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 lg:pb-32 overflow-hidden'>
            {/* Background decoration */}
            <div className='-z-10 absolute inset-0 pointer-events-none' aria-hidden='true'>
                <motion.div
                    className='-top-40 -right-40 absolute bg-primary/10 blur-3xl rounded-full w-80 sm:w-96 h-80 sm:h-96'
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
                    className='-bottom-40 -left-40 absolute bg-accent/10 blur-3xl rounded-full w-80 sm:w-96 h-80 sm:h-96'
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
                    <Badge className='bg-primary/10 mb-4 sm:mb-6 border-2 border-primary/20 text-primary'>
                        AI-Powered Expense Tracker
                    </Badge>
                </motion.div>

                <motion.h1
                    className='font-black text-3xl sm:text-5xl lg:text-6xl text-balance tracking-tight'
                    variants={fadeInUp}
                >
                    Stop logging expenses.{' '}
                    <span className='inline-block relative'>
                        <span className='z-10 relative text-primary'>Start writing them.</span>
                        <motion.span
                            className='right-0 -bottom-1 sm:-bottom-2 left-0 absolute bg-primary/20 h-3 sm:h-4 -skew-x-3'
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                            style={{ originX: 0 }}
                            aria-hidden='true'
                        />
                    </span>
                </motion.h1>

                <motion.p
                    className='mx-auto mt-4 sm:mt-6 max-w-2xl text-muted-foreground text-base sm:text-lg lg:text-xl text-pretty'
                    variants={fadeInUp}
                >
                    Type <span className='font-semibold text-foreground'>&quot;coffee $4.50&quot;</span> and you&apos;re
                    done. No dropdowns, no categories to pick, no forms to fill. Our AI figures out the rest.
                </motion.p>

                <motion.div
                    className='flex sm:flex-row flex-col justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-10'
                    variants={fadeInUp}
                >
                    <Button
                        asChild
                        size='lg'
                        className='shadow-[3px_3px_0px_0px] shadow-foreground/20 w-full sm:w-auto'
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
        <div className='mx-auto mt-10 sm:mt-14 max-w-md'>
            <motion.div
                className='relative'
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <div className='bg-card shadow-[4px_4px_0px_0px] shadow-foreground/10 p-4 border-2 border-border rounded-2xl overflow-hidden'>
                    <p className='text-muted-foreground text-sm text-left'>You type:</p>
                    <p className='mt-2 font-mono text-sm sm:text-base text-left'>
                        <span className='text-foreground'>Lunch with Sarah </span>
                        <span className='font-bold text-accent'>$32</span>
                        <span className='text-foreground'> split the bill</span>
                        <motion.span
                            className='inline-block bg-foreground w-0.5 h-5'
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            aria-hidden='true'
                        />
                    </p>
                    <div className='flex flex-wrap gap-2 mt-4 pt-4 border-t'>
                        <p className='mb-1 w-full text-muted-foreground text-xs text-left'>We get:</p>
                        <motion.span
                            className='inline-flex items-center gap-1.5 bg-accent/10 px-2.5 py-1 rounded-lg font-medium text-accent text-xs'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <span className='bg-accent rounded-full size-1.5' aria-hidden='true' />
                            $32.00
                        </motion.span>
                        <motion.span
                            className='inline-flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-lg font-medium text-primary text-xs'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.95 }}
                        >
                            <span className='bg-primary rounded-full size-1.5' aria-hidden='true' />
                            Food & Dining
                        </motion.span>
                        <motion.span
                            className='inline-flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg font-medium text-muted-foreground text-xs'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1 }}
                        >
                            <span className='bg-muted-foreground rounded-full size-1.5' aria-hidden='true' />
                            Today
                        </motion.span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
