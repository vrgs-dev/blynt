'use client';

import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useSubscription } from '@/lib/api/hooks';
import Link from 'next/link';

export function UpgradeButton() {
    const { data: subscriptionData, isLoading } = useSubscription();
    const planTier = subscriptionData?.plan.tier;

    // Don't show for pro or team users
    if (isLoading || planTier === 'pro' || planTier === 'team') {
        return null;
    }

    return (
        <Button
            asChild
            className='hidden md:inline-flex bg-linear-to-r from-teal-500 via-cyan-500 to-emerald-500 hover:from-teal-600 hover:via-cyan-600 hover:to-emerald-600 shadow-[2px_2px_0px_0px] shadow-teal-500/30 hover:shadow-[3px_3px_0px_0px] hover:shadow-teal-500/40 border-2 border-teal-400/30 font-bold text-white active:scale-[0.98] transition-all hover:-translate-x-px hover:-translate-y-px'
        >
            <Link href='/settings?tab=subscription'>
                <Crown className='size-4' />
                <span className='hidden lg:inline'>Upgrade to Pro</span>
                <span className='lg:hidden'>Pro</span>
            </Link>
        </Button>
    );
}
