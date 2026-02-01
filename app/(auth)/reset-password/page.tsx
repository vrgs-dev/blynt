'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, Lock, ArrowLeft, ShieldCheck, CheckCircle2, Eye, EyeOff, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Include at least one uppercase letter')
            .regex(/[a-z]/, 'Include at least one lowercase letter')
            .regex(/[0-9]/, 'Include at least one number'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const PASSWORD_REQUIREMENTS = [
    { regex: /.{8,}/, label: 'At least 8 characters' },
    { regex: /[A-Z]/, label: 'One uppercase letter' },
    { regex: /[a-z]/, label: 'One lowercase letter' },
    { regex: /[0-9]/, label: 'One number' },
];

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    const [error, setError] = useState<string | null>(
        errorParam === 'INVALID_TOKEN' ? 'This reset link is invalid or has expired.' : null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const password = form.watch('password');

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!token) {
            setError('Invalid reset link. Please request a new one.');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const result = await resetPassword({
                newPassword: data.password,
                token,
            });

            if (result.error) {
                setError(result.error.message || 'Unable to reset password. Please try again.');
                return;
            }

            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // No token - show error state
    if (!token && !isSuccess) {
        return (
            <div className='relative flex justify-center items-center p-4 sm:p-6 min-h-screen'>
                <div className='relative w-full max-w-md'>
                    <div className='relative bg-card shadow-[4px_4px_0px_0px] shadow-foreground/10 p-6 sm:p-8 border-2 border-border rounded-2xl'>
                        <div className='-top-2 -right-2 absolute bg-destructive opacity-80 rounded-lg size-8 rotate-12' />
                        <div className='-top-1 -right-1 absolute bg-destructive rounded-lg size-6 rotate-12' />

                        <div className='flex justify-center mb-6'>
                            <div className='flex justify-center items-center bg-destructive/10 border-2 border-destructive/20 rounded-2xl size-16'>
                                <AlertCircle className='size-8 text-destructive' />
                            </div>
                        </div>

                        <div className='mb-6 text-center'>
                            <h1 className='mb-2 font-black text-foreground text-2xl sm:text-3xl tracking-tight'>
                                Invalid link
                            </h1>
                            <p className='font-medium text-muted-foreground text-sm'>
                                This password reset link is invalid or has expired.
                            </p>
                        </div>

                        <Link href='/forgot-password'>
                            <Button
                                className={cn(
                                    'border-2 border-primary rounded-xl w-full h-12 font-bold text-base',
                                    'shadow-[3px_3px_0px_0px] shadow-primary/30',
                                    'hover:shadow-[1px_1px_0px_0px] hover:shadow-primary/30',
                                    'active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
                                    'transition-all duration-150',
                                )}
                            >
                                Request new link
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    if (isSuccess) {
        return (
            <div className='relative flex justify-center items-center p-4 sm:p-6 min-h-screen'>
                <div className='relative w-full max-w-md'>
                    <div className='relative bg-card shadow-[4px_4px_0px_0px] shadow-foreground/10 p-6 sm:p-8 border-2 border-border rounded-2xl'>
                        <div className='-top-2 -right-2 absolute bg-emerald-500 opacity-80 rounded-lg size-8 rotate-12' />
                        <div className='-top-1 -right-1 absolute bg-emerald-500 rounded-lg size-6 rotate-12' />

                        <div className='flex justify-center mb-6'>
                            <div className='flex justify-center items-center bg-emerald-100 border-2 border-emerald-200 rounded-2xl size-16 animate-in duration-300 zoom-in'>
                                <CheckCircle2 className='size-8 text-emerald-600' />
                            </div>
                        </div>

                        <div className='mb-6 text-center'>
                            <h1 className='mb-2 font-black text-foreground text-2xl sm:text-3xl tracking-tight'>
                                Password reset!
                            </h1>
                            <p className='font-medium text-muted-foreground text-sm'>
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>
                        </div>

                        <Button
                            onClick={() => router.push('/login')}
                            className={cn(
                                'border-2 border-primary rounded-xl w-full h-12 font-bold text-base',
                                'shadow-[3px_3px_0px_0px] shadow-primary/30',
                                'hover:shadow-[1px_1px_0px_0px] hover:shadow-primary/30',
                                'active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
                                'transition-all duration-150',
                            )}
                        >
                            Continue to login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='relative flex justify-center items-center p-4 sm:p-6 py-12 min-h-screen'>
            <div className='relative w-full max-w-md'>
                {/* Main Card */}
                <div className='relative bg-card shadow-[4px_4px_0px_0px] shadow-foreground/10 p-6 sm:p-8 border-2 border-border rounded-2xl transition-all'>
                    {/* Decorative corner accent */}
                    <div className='-top-2 -right-2 absolute bg-primary opacity-80 rounded-lg size-8 rotate-12' />
                    <div className='-top-1 -right-1 absolute bg-primary rounded-lg size-6 rotate-12' />

                    {/* Header */}
                    <div className='mb-6 sm:mb-8'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='flex justify-center items-center bg-primary/10 border-2 border-primary/20 rounded-xl size-10'>
                                <ShieldCheck className='size-5 text-primary' />
                            </div>
                            <h1 className='font-black text-foreground text-2xl sm:text-3xl tracking-tight'>
                                Set new password
                            </h1>
                        </div>
                        <p className='ml-[52px] font-medium text-muted-foreground text-sm'>
                            Create a strong password for your account
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className='flex items-start gap-3 bg-destructive/10 slide-in-from-top-2 mb-6 p-4 border-2 border-destructive/20 rounded-xl animate-in duration-200'>
                            <div className='flex justify-center items-center bg-destructive/20 border-2 border-destructive/30 rounded-lg size-8 shrink-0'>
                                <AlertCircle className='size-4 text-destructive' />
                            </div>
                            <p className='pt-1.5 font-semibold text-destructive text-sm'>{error}</p>
                        </div>
                    )}

                    {/* Reset Password Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-1.5 ml-1 font-bold text-muted-foreground text-xs uppercase tracking-wider'>
                                            <Lock className='size-3' />
                                            New Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    {...field}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder='Enter new password'
                                                    disabled={isLoading}
                                                    className='pr-12 h-12'
                                                />
                                                <button
                                                    type='button'
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className='top-1/2 right-3 absolute hover:bg-muted/50 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-all -translate-y-1/2'
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className='size-5' />
                                                    ) : (
                                                        <Eye className='size-5' />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className='ml-1 font-semibold' />
                                    </FormItem>
                                )}
                            />

                            {/* Password Requirements */}
                            <div className='bg-muted/30 p-4 border-2 border-border rounded-xl'>
                                <p className='mb-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest'>
                                    Password requirements
                                </p>
                                <div className='gap-2 grid grid-cols-2'>
                                    {PASSWORD_REQUIREMENTS.map((req) => {
                                        const isMet = req.regex.test(password || '');
                                        return (
                                            <div
                                                key={req.label}
                                                className={cn(
                                                    'flex items-center gap-2 font-semibold text-xs transition-colors duration-200',
                                                    isMet ? 'text-emerald-600' : 'text-muted-foreground',
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex justify-center items-center border-2 rounded size-4 transition-all duration-200',
                                                        isMet
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'border-muted-foreground/30 bg-transparent',
                                                    )}
                                                >
                                                    {isMet && <Check className='size-2.5 text-white' strokeWidth={3} />}
                                                </div>
                                                {req.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-1.5 ml-1 font-bold text-muted-foreground text-xs uppercase tracking-wider'>
                                            <Lock className='size-3' />
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder='Confirm your password'
                                                    disabled={isLoading}
                                                    className='pr-12 h-12'
                                                />
                                                <button
                                                    type='button'
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className='top-1/2 right-3 absolute hover:bg-muted/50 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-all -translate-y-1/2'
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className='size-5' />
                                                    ) : (
                                                        <Eye className='size-5' />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className='ml-1 font-semibold' />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type='submit'
                                className={cn(
                                    'border-2 border-primary rounded-xl w-full h-12 font-bold text-base',
                                    'shadow-[3px_3px_0px_0px] shadow-primary/30',
                                    'hover:shadow-[1px_1px_0px_0px] hover:shadow-primary/30',
                                    'active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
                                    'transition-all duration-150',
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className='flex items-center gap-2'>
                                        <span className='flex gap-1'>
                                            <span className='bg-primary-foreground rounded-full size-1.5 animate-bounce [animation-delay:-0.3s]' />
                                            <span className='bg-primary-foreground rounded-full size-1.5 animate-bounce [animation-delay:-0.15s]' />
                                            <span className='bg-primary-foreground rounded-full size-1.5 animate-bounce' />
                                        </span>
                                        Resetting...
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-2'>
                                        <ShieldCheck className='size-5' />
                                        Reset password
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Back to login link */}
                    <div className='mt-6 sm:mt-8 text-center'>
                        <Link
                            href='/login'
                            className='inline-flex items-center gap-2 font-semibold text-muted-foreground hover:text-foreground text-sm transition-colors'
                        >
                            <ArrowLeft className='size-4' />
                            Back to login
                        </Link>
                    </div>
                </div>

                {/* Footer tagline */}
                <p className='mt-8 font-semibold text-muted-foreground/60 text-xs text-center uppercase tracking-widest'>
                    Smart finance tracking for everyone
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}
