'use client';

import { Crown, Sparkles, Calendar, TrendingUp, ArrowRight, Tags, Headphones, Infinity } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type UpgradeReason = 'date_range' | 'transaction_limit' | 'feature' | 'history_limit';

interface UpgradeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reason: UpgradeReason;
    details?: {
        requestedDays?: number;
        maxDays?: number;
        currentUsage?: number;
        limit?: number;
    };
}

const REASON_CONFIG: Record<
    UpgradeReason,
    {
        title: string;
        description: string;
        icon: typeof Calendar;
        gradient: string;
    }
> = {
    date_range: {
        title: 'Unlock Full History',
        description: 'Access your complete transaction history with Pro',
        icon: Calendar,
        gradient: 'from-teal-500 via-cyan-500 to-emerald-500',
    },
    transaction_limit: {
        title: 'Unlimited Transactions',
        description: 'Remove monthly limits and track everything',
        icon: TrendingUp,
        gradient: 'from-teal-500 via-teal-400 to-cyan-500',
    },
    feature: {
        title: 'Premium Feature',
        description: 'Unlock advanced features with Pro',
        icon: Sparkles,
        gradient: 'from-cyan-500 via-teal-500 to-emerald-500',
    },
    history_limit: {
        title: 'Unlock Full History',
        description: 'Access your complete transaction history with Pro',
        icon: Calendar,
        gradient: 'from-teal-500 via-cyan-500 to-emerald-500',
    },
};

const PRO_FEATURES = [
    { icon: Infinity, text: 'Unlimited transactions' },
    { icon: Calendar, text: 'Unlimited history access' },
    { icon: Tags, text: 'Advanced categorization' },
    { icon: Sparkles, text: 'AI-powered insights' },
    { icon: Headphones, text: 'Priority support' },
];

export function UpgradeDialog({ open, onOpenChange, reason, details }: UpgradeDialogProps) {
    const config = REASON_CONFIG[reason];
    const Icon = config.icon;
    const router = useRouter();

    const handleUpgrade = () => {
        // Navigate to pricing/upgrade page
        router.push('/settings?tab=subscription');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className='bg-transparent shadow-2xl p-0 border-0 sm:max-w-[460px] overflow-hidden'
            >
                {/* Gradient Header */}
                <div className={cn('relative bg-linear-to-br p-6 pb-16', config.gradient)}>
                    {/* Decorative elements */}
                    <div className='absolute inset-0 opacity-50 bg-[url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="none"/%3E%3Ccircle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.1)"/%3E%3C/svg%3E")]' />
                    <div className='-top-20 -right-20 absolute bg-white/10 blur-3xl rounded-full w-40 h-40' />
                    <div className='-bottom-10 -left-10 absolute bg-white/10 blur-2xl rounded-full w-32 h-32' />

                    {/* Close button */}
                    <button
                        onClick={() => onOpenChange(false)}
                        className='top-4 right-4 absolute flex justify-center items-center bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 text-white transition-colors'
                    >
                        <span className='sr-only'>Close</span>
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                            />
                        </svg>
                    </button>

                    <DialogHeader className='relative text-white'>
                        <div className='flex items-center gap-3 mb-3'>
                            <div className='flex justify-center items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl w-12 h-12'>
                                <Icon className='w-6 h-6' />
                            </div>
                            <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30 rounded-full'>
                                <Crown className='w-3.5 h-3.5' />
                                <span className='font-bold text-xs uppercase tracking-wider'>Pro</span>
                            </div>
                        </div>
                        <DialogTitle className='font-black text-2xl tracking-tight'>{config.title}</DialogTitle>
                        <DialogDescription className='font-medium text-white/80'>
                            {config.description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Content Card */}
                <div className='relative mx-4 -mt-10 mb-4'>
                    <div className='bg-card shadow-lg p-5 border-2 border-border rounded-2xl'>
                        {/* Context message */}
                        {reason === 'date_range' && details?.requestedDays && details?.maxDays && (
                            <div className='bg-muted/50 mb-5 p-4 border-2 border-border border-dashed rounded-xl'>
                                <div className='flex items-start gap-3'>
                                    <div className='flex justify-center items-center bg-amber-100 rounded-xl w-10 h-10 shrink-0'>
                                        <Calendar className='w-5 h-5 text-amber-600' />
                                    </div>
                                    <div>
                                        <p className='font-bold text-foreground text-sm'>
                                            You requested {details.requestedDays} days
                                        </p>
                                        <p className='mt-0.5 text-muted-foreground text-xs'>
                                            Free plan allows up to {details.maxDays} days of history
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {reason === 'transaction_limit' && details?.currentUsage !== undefined && details?.limit && (
                            <div className='bg-muted/50 mb-5 p-4 border-2 border-border border-dashed rounded-xl'>
                                <div className='flex items-start gap-3'>
                                    <div className='flex justify-center items-center bg-rose-100 rounded-xl w-10 h-10 shrink-0'>
                                        <TrendingUp className='w-5 h-5 text-rose-600' />
                                    </div>
                                    <div>
                                        <p className='font-bold text-foreground text-sm'>
                                            {details.currentUsage} / {details.limit} transactions used
                                        </p>
                                        <p className='mt-0.5 text-muted-foreground text-xs'>
                                            You&apos;ve reached your monthly limit
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        <div className='space-y-2.5'>
                            <p className='mb-3 font-bold text-[10px] text-muted-foreground uppercase tracking-widest'>
                                Included with Pro
                            </p>
                            {PRO_FEATURES.map((feature, idx) => (
                                <div key={idx} className='group flex items-center gap-3'>
                                    <div className='flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 rounded-lg w-8 h-8 transition-colors'>
                                        <feature.icon className='w-4 h-4 text-primary' />
                                    </div>
                                    <span className='font-semibold text-foreground text-sm'>{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        <DialogFooter className='flex-col sm:flex-col gap-2 mt-6'>
                            <Button
                                onClick={handleUpgrade}
                                className={cn(
                                    'rounded-xl w-full h-12 font-bold text-base',
                                    'bg-linear-to-r shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]',
                                    config.gradient,
                                )}
                            >
                                <Crown className='mr-2 w-5 h-5' />
                                Upgrade to Pro
                                <ArrowRight className='ml-2 w-5 h-5' />
                            </Button>
                            <button
                                onClick={() => onOpenChange(false)}
                                className='py-2 font-medium text-muted-foreground hover:text-foreground text-sm transition-colors'
                            >
                                Maybe later
                            </button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UpgradeDialog;
