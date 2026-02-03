'use client';

import * as motion from 'motion/react-client';
import { CreditCard, Check, Sparkles, Crown, Infinity, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/components/animations';
import { useSubscription, usePlans } from '@/lib/api/hooks';
import { useState } from 'react';
import type { PlanWithFeatures } from '@/lib/api/plans';

// Feature display config with icons and formatting
const FEATURE_CONFIG: Record<string, { label: string; format: (v: string) => string; teamOnly?: boolean }> = {
    transactions_per_month: {
        label: 'Transactions',
        format: (v) => (v === 'unlimited' ? 'Unlimited' : `${v}/month`),
    },
    history_days: {
        label: 'History',
        format: (v) => (v === 'unlimited' ? 'Unlimited' : `${v} days`),
    },
    natural_language_input: {
        label: 'Natural language input',
        format: () => 'Included',
    },
    advanced_categorization: {
        label: 'Advanced AI categorization',
        format: () => 'Included',
    },
    ai_insights: {
        label: 'AI-powered insights',
        format: () => 'Included',
    },
    priority_support: {
        label: 'Priority support',
        format: () => 'Included',
    },
    team_members: {
        label: 'Team members',
        format: (v) => `Up to ${v}`,
        teamOnly: true,
    },
    shared_workspaces: {
        label: 'Shared workspaces',
        format: () => 'Included',
        teamOnly: true,
    },
    team_analytics: {
        label: 'Team analytics',
        format: () => 'Included',
        teamOnly: true,
    },
    csv_export: {
        label: 'CSV export',
        format: () => 'Included',
    },
    auto_categorization: {
        label: 'Auto-categorization',
        format: () => 'Included',
    },
};

// Features to show for each tier (in order of importance)
const TIER_HIGHLIGHT_FEATURES: Record<string, string[]> = {
    free: ['transactions_per_month', 'history_days', 'natural_language_input', 'auto_categorization', 'csv_export'],
    pro: ['transactions_per_month', 'history_days', 'advanced_categorization', 'ai_insights', 'priority_support'],
    team: ['team_members', 'shared_workspaces', 'team_analytics'],
};

export function SubscriptionTab() {
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

    const { data: subscriptionData, isLoading: isLoadingSubscription } = useSubscription();
    const { data: plansData, isLoading: isLoadingPlans } = usePlans();

    const isLoading = isLoadingSubscription || isLoadingPlans;

    if (isLoading) {
        return (
            <div className='flex justify-center items-center py-12'>
                <Loader2 className='size-8 text-primary animate-spin' />
            </div>
        );
    }

    const currentTier = subscriptionData?.plan.tier || 'free';
    const currentPlanFeatures = subscriptionData?.plan.features;
    const usage = subscriptionData?.usage;

    const availablePlans = plansData?.plans[billingInterval] || [];

    return (
        <motion.div className='space-y-6' variants={staggerContainer} initial='hidden' animate='visible'>
            <motion.div variants={fadeInUp}>
                <h2 className='font-bold text-xl'>Subscription Plan</h2>
                <p className='text-muted-foreground text-sm'>Manage your plan and billing information</p>
            </motion.div>

            {/* Current Plan */}
            <motion.div
                variants={fadeInUp}
                className='bg-linear-to-br from-primary/5 to-primary/10 shadow-[3px_3px_0px_0px] shadow-primary/20 p-6 border-2 border-primary/50 rounded-xl'
            >
                <div className='flex justify-between items-start gap-4 mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='flex justify-center items-center bg-primary/20 rounded-xl size-12'>
                            {currentTier === 'free' ? (
                                <CreditCard className='size-6 text-primary' />
                            ) : (
                                <Crown className='size-6 text-primary' />
                            )}
                        </div>
                        <div>
                            <div className='flex items-center gap-2'>
                                <h3 className='font-bold text-xl capitalize'>{currentTier}</h3>
                                <Badge>Current</Badge>
                            </div>
                            <p className='text-muted-foreground text-sm'>
                                {currentTier === 'free'
                                    ? 'Basic features to get started'
                                    : currentTier === 'pro'
                                      ? 'Full access for power users'
                                      : 'Collaborate with your team'}
                            </p>
                        </div>
                    </div>
                    {usage && currentTier === 'free' && (
                        <div className='text-right'>
                            <p className='font-black text-2xl'>
                                {usage.transactionsUsed}/{usage.transactionsLimit}
                            </p>
                            <p className='text-muted-foreground text-xs'>transactions this month</p>
                        </div>
                    )}
                </div>

                {currentPlanFeatures && (
                    <ul className='gap-2 grid sm:grid-cols-2 mb-4'>
                        <li className='flex items-center gap-2 text-sm'>
                            <Check className='size-4 text-primary shrink-0' />
                            <span>
                                {currentPlanFeatures.maxTransactionsPerMonth === 999999
                                    ? 'Unlimited transactions'
                                    : `${currentPlanFeatures.maxTransactionsPerMonth} transactions/month`}
                            </span>
                        </li>
                        <li className='flex items-center gap-2 text-sm'>
                            <Check className='size-4 text-primary shrink-0' />
                            <span>
                                {currentPlanFeatures.historyDays === 999999
                                    ? 'Unlimited history'
                                    : `${currentPlanFeatures.historyDays}-day history`}
                            </span>
                        </li>
                        {currentPlanFeatures.naturalLanguage && (
                            <li className='flex items-center gap-2 text-sm'>
                                <Check className='size-4 text-primary shrink-0' />
                                <span>Natural language input</span>
                            </li>
                        )}
                        {currentPlanFeatures.csvExport && (
                            <li className='flex items-center gap-2 text-sm'>
                                <Check className='size-4 text-primary shrink-0' />
                                <span>CSV export</span>
                            </li>
                        )}
                    </ul>
                )}
            </motion.div>

            {/* Billing Interval Toggle */}
            {currentTier === 'free' && (
                <motion.div variants={fadeInUp} className='flex justify-center items-center gap-2'>
                    <button
                        onClick={() => setBillingInterval('monthly')}
                        className={cn(
                            'px-4 py-2 rounded-xl font-semibold text-sm transition-all',
                            billingInterval === 'monthly'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:text-foreground',
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingInterval('yearly')}
                        className={cn(
                            'px-4 py-2 rounded-xl font-semibold text-sm transition-all',
                            billingInterval === 'yearly'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:text-foreground',
                        )}
                    >
                        Yearly
                        <Badge variant='secondary' className='ml-2 text-[10px]'>
                            Save 17%
                        </Badge>
                    </button>
                </motion.div>
            )}

            {/* Upgrade Options */}
            {currentTier === 'free' && (
                <motion.div variants={fadeInUp}>
                    <h3 className='mb-4 font-bold'>Upgrade Your Plan</h3>
                    <div className='gap-4 grid md:grid-cols-2'>
                        {availablePlans
                            .filter((plan) => plan.tier !== 'free')
                            .map((plan) => (
                                <PlanCard key={plan.id} plan={plan} currentTier={currentTier} />
                            ))}
                    </div>
                </motion.div>
            )}

            {/* Manage Subscription for paid users */}
            {currentTier !== 'free' && (
                <motion.div variants={fadeInUp}>
                    <div className='bg-muted/30 p-6 border-2 border-border rounded-xl'>
                        <h3 className='mb-2 font-bold'>Manage Subscription</h3>
                        <p className='mb-4 text-muted-foreground text-sm'>
                            Update your payment method, view invoices, or cancel your subscription.
                        </p>
                        <Button variant='outline'>Manage Billing</Button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

function PlanCard({ plan, currentTier }: { plan: PlanWithFeatures; currentTier: string }) {
    const isPopular = plan.isPopular;
    const isTeam = plan.tier === 'team';
    const price = parseFloat(plan.price);

    // Get features to display based on tier
    const highlightFeatures = TIER_HIGHLIGHT_FEATURES[plan.tier] || [];
    const displayFeatures = highlightFeatures
        .filter((key) => plan.features[key])
        .map((key) => ({
            key,
            value: plan.features[key],
            config: FEATURE_CONFIG[key],
        }));

    return (
        <motion.div
            className={cn(
                'relative p-6 border-2 rounded-xl overflow-hidden transition-all',
                isPopular
                    ? 'border-primary bg-linear-to-br from-primary/5 to-primary/10 shadow-[3px_3px_0px_0px] shadow-primary/20'
                    : isTeam
                      ? 'border-amber-400/50 bg-linear-to-br from-amber-50/50 to-orange-50/50'
                      : 'border-border bg-background',
                currentTier === 'team' && 'opacity-80',
            )}
            whileHover={!isTeam ? { y: -4 } : undefined}
        >
            {isPopular && (
                <div className='top-0 right-0 absolute'>
                    <div className='flex items-center gap-1 bg-primary px-3 py-1 rounded-bl-xl font-bold text-primary-foreground text-xs'>
                        <Sparkles className='size-3' />
                        Popular
                    </div>
                </div>
            )}

            {isTeam && (
                <div className='top-0 right-0 absolute'>
                    <div className='flex items-center gap-1 bg-amber-500 px-3 py-1 rounded-bl-xl font-bold text-white text-xs'>
                        <Users className='size-3' />
                        Teams
                    </div>
                </div>
            )}

            <div className='mb-4'>
                <h4 className='font-bold text-lg capitalize'>{plan.tier}</h4>
                <p className='text-muted-foreground text-sm'>{plan.description}</p>
            </div>

            <div className='mb-4'>
                <span className='font-black text-3xl'>${price.toFixed(0)}</span>
                <span className='text-muted-foreground'>/{plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
            </div>

            {/* Show "Everything in Pro" for Team */}
            {isTeam && (
                <div className='mb-3 pb-3 border-amber-200 border-b'>
                    <p className='flex items-center gap-2 font-semibold text-amber-700 text-sm'>
                        <Check className='size-4' />
                        Everything in Pro, plus:
                    </p>
                </div>
            )}

            <ul className='space-y-2 mb-6'>
                {displayFeatures.map(({ key, value, config }) => (
                    <li
                        key={key}
                        className={cn(
                            'flex items-center gap-2 text-sm',
                            config?.teamOnly && 'font-semibold text-amber-700',
                        )}
                    >
                        {value === 'unlimited' ? (
                            <Infinity
                                className={cn('size-4 shrink-0', config?.teamOnly ? 'text-amber-600' : 'text-primary')}
                            />
                        ) : (
                            <Check
                                className={cn('size-4 shrink-0', config?.teamOnly ? 'text-amber-600' : 'text-primary')}
                            />
                        )}
                        <span>
                            {config?.label || key}
                            {config?.format && value !== 'true' && `: ${config.format(value)}`}
                        </span>
                    </li>
                ))}
            </ul>

            <Button
                className={cn(
                    'w-full',
                    isPopular && 'shadow-[2px_2px_0px_0px] shadow-foreground/10',
                    isTeam && 'bg-amber-500 hover:bg-amber-600 text-white',
                )}
                variant={isPopular ? 'default' : isTeam ? 'default' : 'outline'}
                disabled={isTeam}
            >
                {isPopular && <Sparkles className='mr-2 size-4' />}
                {isTeam && <Users className='mr-2 size-4' />}
                {isTeam ? 'Coming Soon' : `Upgrade to ${plan.tier}`}
            </Button>
        </motion.div>
    );
}
