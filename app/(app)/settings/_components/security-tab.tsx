'use client';

import { useState } from 'react';
import * as motion from 'motion/react-client';
import { Eye, EyeOff, Lock, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import { fadeInUp, staggerContainer } from '../../../../components/animations';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

function PasswordInput({ className, ...props }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className='relative'>
            <Input {...props} type={isVisible ? 'text' : 'password'} className={cn('pr-10', className)} />
            <button
                type='button'
                onClick={() => setIsVisible(!isVisible)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm'
            >
                {isVisible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
            </button>
        </div>
    );
}

export function SecurityTab() {
    const [isLoading, setIsLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setSaveMessage({ type, text });
        setTimeout(() => setSaveMessage(null), 3000);
    };

    const handleUpdatePassword = async () => {
        // Validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            showMessage('error', 'Please fill in all fields');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            showMessage('error', 'Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            showMessage('error', 'Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await authClient.changePassword(
                {
                    newPassword: formData.newPassword,
                    currentPassword: formData.currentPassword,
                    revokeOtherSessions: true,
                },
                {
                    onSuccess: () => {
                        showMessage('success', 'Password updated successfully');
                        setFormData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                        });
                    },
                    onError: (ctx) => {
                        showMessage('error', ctx.error.message || 'Failed to update password');
                    },
                },
            );
        } catch (error) {
            console.error('Error updating password:', error);
            showMessage('error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div className='space-y-6' variants={staggerContainer} initial='hidden' animate='visible'>
            <motion.div variants={fadeInUp} className='flex items-center justify-between'>
                <div>
                    <h2 className='text-xl font-bold'>Security Settings</h2>
                    <p className='text-sm text-muted-foreground'>Protect your account with strong security measures</p>
                </div>
                {saveMessage && (
                    <div
                        className={cn(
                            'animate-in fade-in slide-in-from-right-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold',
                            saveMessage.type === 'success'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-red-200 bg-red-50 text-red-700',
                        )}
                    >
                        {saveMessage.text}
                    </div>
                )}
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
                        <PasswordInput
                            name='currentPassword'
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder='••••••••'
                            className='border-2'
                        />
                    </div>
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label className='font-semibold'>New Password</Label>
                            <PasswordInput
                                name='newPassword'
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder='••••••••'
                                className='border-2'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='font-semibold'>Confirm Password</Label>
                            <PasswordInput
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder='••••••••'
                                className='border-2'
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleUpdatePassword}
                        disabled={isLoading}
                        className='w-full shadow-[2px_2px_0px_0px] shadow-foreground/10 sm:w-auto'
                    >
                        {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
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
