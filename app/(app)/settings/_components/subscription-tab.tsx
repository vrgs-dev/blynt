'use client';

import * as motion from 'motion/react-client';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { plans, type Plan } from '@/constants/pricing';
import { fadeInUp, staggerContainer } from '../../../../components/animations';

interface SubscriptionTabProps {
    currentPlanName: string;
}

export function SubscriptionTab({ currentPlanName }: SubscriptionTabProps) {
    const currentPlan = plans.find((p) => p.name === currentPlanName) || plans[0];

    return (
        <motion.div className='space-y-6' variants={staggerContainer} initial='hidden' animate='visible'>
            <motion.div variants={fadeInUp}>
                <h2 className='text-xl font-bold'>Subscription Plan</h2>
                <p className='text-sm text-muted-foreground'>Manage your plan and billing information</p>
            </motion.div>

            {/* Current Plan */}
            <CurrentPlanCard plan={currentPlan} />

            {/* Upgrade Options */}
            {currentPlan.name !== 'Pro' && (
                <motion.div variants={fadeInUp}>
                    <h3 className='mb-4 font-bold'>Upgrade Your Plan</h3>
                    <div className='grid gap-4 md:grid-cols-2'>
                        {plans
                            .filter((plan) => plan.name !== currentPlan.name)
                            .map((plan) => (
                                <PlanCard key={plan.name} plan={plan} />
                            ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

function CurrentPlanCard({ plan }: { plan: Plan }) {
    return (
        <motion.div
            variants={fadeInUp}
            className='rounded-xl border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-[3px_3px_0px_0px] shadow-primary/20'
        >
            <div className='mb-4 flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                    <div className='flex size-12 items-center justify-center rounded-xl bg-primary/20'>
                        <CreditCard className='size-6 text-primary' />
                    </div>
                    <div>
                        <div className='flex items-center gap-2'>
                            <h3 className='text-xl font-bold'>{plan.name}</h3>
                            <Badge>Current</Badge>
                        </div>
                        <p className='text-sm text-muted-foreground'>{plan.description}</p>
                    </div>
                </div>
                <div className='text-right'>
                    <p className='text-3xl font-black'>{plan.price}</p>
                    <p className='text-xs text-muted-foreground'>{plan.period}</p>
                </div>
            </div>

            <ul className='mb-6 grid gap-2 sm:grid-cols-2'>
                {plan.features.map((feature) => (
                    <li key={feature} className='flex items-center gap-2 text-sm'>
                        <Check className='size-4 shrink-0 text-primary' />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
}

function PlanCard({ plan }: { plan: Plan }) {
    return (
        <motion.div
            className={cn(
                'rounded-xl border-2 p-6 transition-all',
                plan.popular
                    ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-[3px_3px_0px_0px] shadow-primary/20'
                    : 'border-border bg-background',
                plan.disabled && 'opacity-60',
            )}
            whileHover={!plan.disabled ? { y: -4 } : undefined}
        >
            <div className='mb-4 flex items-center justify-between'>
                <div>
                    <h4 className='text-lg font-bold'>{plan.name}</h4>
                    <p className='text-sm text-muted-foreground'>{plan.description}</p>
                </div>
                {plan.popular && (
                    <Badge className='bg-primary text-primary-foreground'>
                        <Sparkles className='mr-1 size-3' />
                        Popular
                    </Badge>
                )}
            </div>
            <div className='mb-4'>
                <span className='text-3xl font-black'>{plan.price}</span>
                <span className='text-muted-foreground'>/{plan.period}</span>
            </div>
            <ul className='mb-6 space-y-2'>
                {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className='flex items-center gap-2 text-sm'>
                        <Check className='size-4 shrink-0 text-primary' />
                        <span>{feature}</span>
                    </li>
                ))}
                {plan.features.length > 4 && (
                    <li className='text-sm text-muted-foreground'>+{plan.features.length - 4} more features</li>
                )}
            </ul>
            <Button
                className={cn('w-full', plan.popular && 'shadow-[2px_2px_0px_0px] shadow-foreground/10')}
                variant={plan.popular ? 'default' : 'outline'}
                disabled={plan.disabled}
            >
                {plan.popular && <Sparkles className='mr-2 size-4' />}
                {plan.cta}
            </Button>
        </motion.div>
    );
}
