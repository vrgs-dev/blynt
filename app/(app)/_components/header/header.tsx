'use client';

import Link from 'next/link';
import { LogoAnimated } from '@/components/logo';
import { DashboardNavigationTabs } from './dashboard-navigation-tabs';
import { UpgradeButton } from './upgrade-button';
import { UserMenu } from './user-menu';

export default function Header() {
    return (
        <header className='w-full'>
            <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
                <div className='flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4'>
                    <Link href='/' className='shrink-0'>
                        <LogoAnimated size='md' />
                    </Link>

                    <DashboardNavigationTabs />

                    <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
                        <UpgradeButton />
                        <UserMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
