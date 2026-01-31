'use client';

import Link from 'next/link';
import { LogoAnimated } from '@/components/logo';
import { DashboardNavigationTabs } from './dashboard-navigation-tabs';
import { UpgradeButton } from './upgrade-button';
import { UserMenu } from './user-menu';

export default function Header() {
    return (
        <header className='py-3 sm:py-4 w-full'>
            <div className='mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl'>
                <div className='overflow-hidden'>
                    <div className='flex justify-between items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 h-14 sm:h-16'>
                        <Link href='/' className='shrink-0'>
                            <LogoAnimated size='md' />
                        </Link>

                        <DashboardNavigationTabs />

                        <div className='flex items-center gap-2 sm:gap-3'>
                            <UpgradeButton />
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
