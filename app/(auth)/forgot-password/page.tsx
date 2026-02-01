'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { AlertCircle, Mail, ArrowLeft, KeyRound, CheckCircle2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '../_components/footer';

const forgotPasswordSchema = z.object({
    email: z.email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setError(null);
        setIsLoading(true);

        try {
            const result = await requestPasswordReset({
                email: data.email,
                redirectTo: '/reset-password',
            });

            if (result.error) {
                setError(result.error.message || 'Unable to send reset email. Please try again.');
                return;
            }

            setSubmittedEmail(data.email);
            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success state
    if (isSuccess) {
        return (
            <div className='relative flex justify-center items-center p-4 sm:p-6 min-h-screen'>
                <div className='relative w-full max-w-md'>
                    {/* Success Card */}
                    <div className='relative bg-card shadow-[4px_4px_0px_0px] shadow-foreground/10 p-6 sm:p-8 border-2 border-border rounded-2xl transition-all'>
                        {/* Decorative corner accent */}
                        <div className='-top-2 -right-2 absolute bg-emerald-500 opacity-80 rounded-lg size-8 rotate-12' />
                        <div className='-top-1 -right-1 absolute bg-emerald-500 rounded-lg size-6 rotate-12' />

                        {/* Success Icon */}
                        <div className='flex justify-center mb-6'>
                            <div className='flex justify-center items-center bg-emerald-100 border-2 border-emerald-200 rounded-2xl size-16 animate-in duration-300 zoom-in'>
                                <CheckCircle2 className='size-8 text-emerald-600' />
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className='mb-6 text-center'>
                            <h1 className='mb-2 font-black text-foreground text-2xl sm:text-3xl tracking-tight'>
                                Check your email
                            </h1>
                            <p className='font-medium text-muted-foreground text-sm'>
                                We sent a password reset link to
                            </p>
                            <p className='mt-1 font-bold text-foreground text-sm'>{submittedEmail}</p>
                        </div>

                        {/* Instructions */}
                        <div className='bg-muted/30 mb-6 p-4 border-2 border-border rounded-xl'>
                            <p className='text-muted-foreground text-xs text-center leading-relaxed'>
                                Click the link in the email to reset your password. If you don&apos;t see it, check your
                                spam folder. The link expires in 1 hour.
                            </p>
                        </div>

                        {/* Back to Login */}
                        <Link href='/login'>
                            <Button
                                variant='outline'
                                className={cn(
                                    'border-2 rounded-xl w-full h-12 font-bold text-base',
                                    'shadow-[3px_3px_0px_0px] shadow-foreground/5',
                                    'hover:shadow-[1px_1px_0px_0px] hover:shadow-foreground/5',
                                    'active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
                                    'transition-all duration-150',
                                )}
                            >
                                <ArrowLeft className='size-5' />
                                Back to login
                            </Button>
                        </Link>

                        {/* Resend option */}
                        <p className='mt-6 text-muted-foreground text-xs text-center'>
                            Didn&apos;t receive the email?{' '}
                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    form.reset();
                                }}
                                className='font-bold text-primary hover:text-primary/80 underline underline-offset-2'
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='relative flex justify-center items-center p-4 sm:p-6 min-h-screen'>
            <div className='relative w-full max-w-md'>
                {/* Main Card - Soft Brutalism Style */}
                <div className='relative bg-card shadow-[4px_4px_0px_0px] shadow-foreground/10 p-6 sm:p-8 border-2 border-border rounded-2xl transition-all'>
                    {/* Decorative corner accent */}
                    <div className='-top-2 -left-2 absolute bg-amber-500 opacity-80 rounded-lg size-8 -rotate-12' />
                    <div className='-top-1 -left-1 absolute bg-amber-500 rounded-lg size-6 -rotate-12' />

                    {/* Header */}
                    <div className='mb-6 sm:mb-8'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='flex justify-center items-center bg-amber-100 border-2 border-amber-200 rounded-xl size-10'>
                                <KeyRound className='size-5 text-amber-600' />
                            </div>
                            <h1 className='font-black text-foreground text-2xl sm:text-3xl tracking-tight'>
                                Forgot password?
                            </h1>
                        </div>
                        <p className='ml-[52px] font-medium text-muted-foreground text-sm'>
                            No worries, we&apos;ll send you reset instructions
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

                    {/* Forgot Password Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-1.5 ml-1 font-bold text-muted-foreground text-xs uppercase tracking-wider'>
                                            <Mail className='size-3' />
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='email'
                                                placeholder='you@example.com'
                                                disabled={isLoading}
                                                className='h-12'
                                            />
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
                                        Sending...
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-2'>
                                        <Send className='size-5' />
                                        Send reset link
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
                <Footer />
            </div>
        </div>
    );
}
