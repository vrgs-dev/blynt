'use client';

import * as motion from 'motion/react-client';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer } from '@/components/animations';

interface DangerTabProps {
    onDeleteAccount: () => void;
}

export function DangerTab({ onDeleteAccount }: DangerTabProps) {
    return (
        <motion.div className='space-y-6' variants={staggerContainer} initial='hidden' animate='visible'>
            <motion.div variants={fadeInUp}>
                <h2 className='text-xl font-bold text-destructive'>Danger Zone</h2>
                <p className='text-sm text-muted-foreground'>Irreversible actions — proceed with caution</p>
            </motion.div>

            <motion.div
                variants={fadeInUp}
                className='rounded-xl border-2 border-destructive/50 bg-destructive/5 p-6 shadow-[3px_3px_0px_0px] shadow-destructive/20'
            >
                <div className='mb-4 flex items-start gap-4'>
                    <div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10'>
                        <AlertTriangle className='size-6 text-destructive' />
                    </div>
                    <div className='flex-1'>
                        <h3 className='text-lg font-bold text-destructive'>Delete Account</h3>
                        <p className='text-sm text-muted-foreground'>
                            Permanently delete your account and all associated data including transactions, categories,
                            and settings. This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className='flex flex-col gap-3 border-t border-destructive/20 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-xs text-muted-foreground'>
                        Type <span className='font-mono font-bold'>DELETE</span> to confirm
                    </p>
                    <Button variant='destructive' className='w-full sm:w-auto' onClick={onDeleteAccount}>
                        Delete My Account
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
