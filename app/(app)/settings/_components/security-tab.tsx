'use client';

import * as motion from 'motion/react-client';
import { Lock, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer } from '../../../../components/animations';

export function SecurityTab() {
    return (
        <motion.div className='space-y-6' variants={staggerContainer} initial='hidden' animate='visible'>
            <motion.div variants={fadeInUp}>
                <h2 className='text-xl font-bold'>Security Settings</h2>
                <p className='text-sm text-muted-foreground'>Protect your account with strong security measures</p>
            </motion.div>

            {/* Password Section */}
            <motion.div
                variants={fadeInUp}
                className='space-y-4 rounded-xl border-2 border-border bg-background p-4 sm:p-6'
            >
                <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10'>
                        <Lock className='size-5 text-primary' />
                    </div>
                    <div>
                        <h3 className='font-bold'>Change Password</h3>
                        <p className='text-sm text-muted-foreground'>Use a strong, unique password</p>
                    </div>
                </div>

                <div className='space-y-4 pt-2'>
                    <div className='space-y-2'>
                        <Label className='font-semibold'>Current Password</Label>
                        <Input type='password' placeholder='••••••••' className='border-2' />
                    </div>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label className='font-semibold'>New Password</Label>
                            <Input type='password' placeholder='••••••••' className='border-2' />
                        </div>
                        <div className='space-y-2'>
                            <Label className='font-semibold'>Confirm Password</Label>
                            <Input type='password' placeholder='••••••••' className='border-2' />
                        </div>
                    </div>
                    <Button className='w-full shadow-[2px_2px_0px_0px] shadow-foreground/10 sm:w-auto'>
                        Update Password
                    </Button>
                </div>
            </motion.div>

            {/* 2FA Section */}
            <motion.div
                variants={fadeInUp}
                className='flex flex-col gap-4 rounded-xl border-2 border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6'
            >
                <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                        <Smartphone className='size-5 text-muted-foreground' />
                    </div>
                    <div>
                        <h3 className='font-bold'>Two-Factor Authentication</h3>
                        <p className='text-sm text-muted-foreground'>Add an extra layer of security</p>
                    </div>
                </div>
                <Badge variant='outline' className='w-fit'>
                    Coming Soon
                </Badge>
            </motion.div>
        </motion.div>
    );
}
