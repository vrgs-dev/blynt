'use client';

import * as motion from 'motion/react-client';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { fadeInUp, staggerContainer } from '../../../../components/animations';
import { initials } from '@/lib/utils';

interface ProfileTabProps {
    name: string;
    email: string;
    planName: string;
    onNameChange: (name: string) => void;
    onReset: () => void;
    onSave: () => void;
    isSaving?: boolean;
}

export function ProfileTab({ name, email, planName, onNameChange, onReset, onSave, isSaving }: ProfileTabProps) {
    return (
        <motion.div className='space-y-6' variants={staggerContainer} initial='hidden' animate='visible'>
            <motion.div variants={fadeInUp}>
                <h2 className='text-xl font-bold'>Profile Information</h2>
                <p className='text-sm text-muted-foreground'>Update your personal details and preferences</p>
            </motion.div>

            {/* Avatar Section */}
            <motion.div
                variants={fadeInUp}
                className='flex flex-col items-center gap-4 rounded-xl border-2 border-border bg-muted/30 p-6 sm:flex-row sm:items-start'
            >
                <div className='relative'>
                    <Avatar className='size-20 rounded-2xl border-2 border-primary/20 bg-linear-to-br from-primary/20 to-primary/5 shadow-[3px_3px_0px_0px] shadow-foreground/10'>
                        <AvatarFallback className='rounded-2xl bg-transparent text-2xl font-black text-primary'>
                            {initials(name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='absolute -bottom-1 -right-1 rounded-full border-2 border-background bg-primary p-1'>
                        <Check className='size-3 text-primary-foreground' />
                    </div>
                </div>
                <div className='flex-1 text-center sm:text-left'>
                    <p className='text-lg font-bold'>{name || 'User'}</p>
                    <p className='text-sm text-muted-foreground'>{email}</p>
                    <Badge variant='secondary' className='mt-2'>
                        {planName} Plan
                    </Badge>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div
                variants={fadeInUp}
                className='space-y-4 rounded-xl border-2 border-border bg-background p-4 sm:p-6'
            >
                <div className='space-y-2'>
                    <Label className='font-semibold'>Display Name</Label>
                    <Input
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        className='border-2'
                        placeholder='Enter your name'
                    />
                </div>

                <div className='space-y-2'>
                    <Label className='font-semibold'>Email</Label>
                    <Input disabled value={email} className='border-2 bg-muted' />
                    <p className='text-xs text-muted-foreground'>Email cannot be changed. Contact support if needed.</p>
                </div>

                <div className='flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end'>
                    <Button variant='outline' onClick={onReset} disabled={isSaving}>
                        Reset
                    </Button>
                    <Button
                        className='shadow-[2px_2px_0px_0px] shadow-foreground/10'
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className='mr-2 size-4 animate-spin' />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
