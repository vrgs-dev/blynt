'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertCircle, Mail, Lock, User, ArrowRight, Rocket, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '../_components/footer';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Include at least one uppercase letter')
        .regex(/[a-z]/, 'Include at least one lowercase letter')
        .regex(/[0-9]/, 'Include at least one number'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setError(null);
        setIsLoading(true);

        try {
            const result = await signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (result.error) {
                setError(result.error.message || 'Unable to create your account. Please try again.');
                return;
            }

            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to create your account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const result = await signIn.social({
                provider: 'google',
                callbackURL: '/dashboard',
            });

            if (result.error) {
                setError(result.error.message || 'Unable to sign up with Google. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to sign up with Google. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className='relative flex justify-center items-center p-4 sm:p-6 py-12 min-h-screen'>
            <div className='relative w-full max-w-md'>
                {/* Main Card - Soft Brutalism Style */}
                <div className='relative bg-card shadow-[4px_4px_0px_0px] shadow-foreground/10 p-6 sm:p-8 border-2 border-border rounded-2xl transition-all'>
                    {/* Decorative corner accent */}
                    <div className='-top-2 -left-2 absolute bg-accent opacity-80 rounded-lg size-8 -rotate-12' />
                    <div className='-top-1 -left-1 absolute bg-accent rounded-lg size-6 -rotate-12' />

                    {/* Header */}
                    <div className='mb-6 sm:mb-8'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='flex justify-center items-center bg-accent/10 border-2 border-accent/20 rounded-xl size-10'>
                                <Rocket className='size-5 text-accent' />
                            </div>
                            <h1 className='font-black text-foreground text-2xl sm:text-3xl tracking-tight'>
                                Create account
                            </h1>
                        </div>
                        <p className='ml-[52px] font-medium text-muted-foreground text-sm'>
                            Get started in just a few steps
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

                    {/* Signup Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-1.5 ml-1 font-bold text-muted-foreground text-xs uppercase tracking-wider'>
                                            <User className='size-3' />
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='text'
                                                placeholder='John Doe'
                                                disabled={isLoading}
                                                className='h-12'
                                            />
                                        </FormControl>
                                        <FormMessage className='ml-1 font-semibold' />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-1.5 ml-1 font-bold text-muted-foreground text-xs uppercase tracking-wider'>
                                            <Lock className='size-3' />
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    {...field}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder='Create a strong password'
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
                                        Creating account
                                    </span>
                                ) : (
                                    <span className='flex items-center gap-2'>
                                        Create account
                                        <ArrowRight className='size-5 transition-transform group-hover:translate-x-0.5' />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Divider */}
                    <div className='relative my-6 sm:my-8'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='border-border border-t-2 border-dashed w-full' />
                        </div>
                        <div className='relative flex justify-center'>
                            <span className='bg-card px-4 font-bold text-muted-foreground text-xs uppercase tracking-widest'>
                                or sign up with
                            </span>
                        </div>
                    </div>

                    {/* Google Sign Up */}
                    <Button
                        type='button'
                        variant='outline'
                        className={cn(
                            'border-2 rounded-xl w-full h-12 font-bold text-base',
                            'shadow-[3px_3px_0px_0px] shadow-foreground/5',
                            'hover:shadow-[1px_1px_0px_0px] hover:shadow-foreground/5',
                            'active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
                            'transition-all duration-150',
                        )}
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                    >
                        <svg className='size-5' viewBox='0 0 24 24'>
                            <path
                                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                fill='#4285F4'
                            />
                            <path
                                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                fill='#34A853'
                            />
                            <path
                                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                fill='#FBBC05'
                            />
                            <path
                                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                fill='#EA4335'
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Login link */}
                    <div className='mt-6 sm:mt-8 text-center'>
                        <p className='font-medium text-muted-foreground text-sm'>
                            Already have an account?{' '}
                            <Link
                                href='/login'
                                className='font-bold text-primary hover:text-primary/80 decoration-2 decoration-primary/30 hover:decoration-primary underline underline-offset-4 transition-colors'
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer tagline */}
                <Footer />
            </div>
        </div>
    );
}
