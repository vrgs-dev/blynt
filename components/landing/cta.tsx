'use client';

import Link from 'next/link';
import * as motion from 'motion/react-client';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@/components/icons';

export function CTA() {
    return (
        <section className='px-4 py-16 sm:px-6 sm:py-24'>
            <motion.div
                className='mx-auto max-w-2xl text-center'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
            >
                <h2 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                    Your next expense takes 3 seconds to log
                </h2>
                <p className='mt-3 text-muted-foreground sm:mt-4 sm:text-lg'>
                    No credit card. No setup. Just type your first expense and watch the magic happen.
                </p>

                <motion.div className='mt-8' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button asChild size='lg' className='shadow-[3px_3px_0px_0px] shadow-foreground/20'>
                        <Link href='/login'>
                            Try Your First Entry
                            <ArrowRightIcon />
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}
