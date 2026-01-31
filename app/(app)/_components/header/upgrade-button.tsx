'use client';

import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';

export function UpgradeButton() {
    return (
        <Button className='hidden md:inline-flex bg-linear-to-r from-amber-500 hover:from-amber-600 to-orange-500 hover:to-orange-600 shadow-[2px_2px_0px_0px] shadow-amber-600/20 hover:shadow-[3px_3px_0px_0px] hover:shadow-amber-600/30 border-2 border-amber-600/30 font-bold text-white transition-all hover:-translate-x-px hover:-translate-y-px'>
            <StarIcon className='fill-white size-4' />
            <span className='hidden lg:inline'>Upgrade to Pro</span>
            <span className='lg:hidden'>Pro</span>
        </Button>
    );
}
