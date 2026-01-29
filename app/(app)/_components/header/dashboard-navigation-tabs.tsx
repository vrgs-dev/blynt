'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboardTabsConfig } from '../dashboard/config';
import type { DashboardTab } from '../dashboard/types';

export function DashboardNavigationTabs() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentTab = (searchParams.get('tab') as DashboardTab) || dashboardTabsConfig[0].value;

    const handleTabChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', value);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <nav className='flex-1 flex justify-center max-w-md mx-auto'>
            <Tabs
                value={currentTab}
                onValueChange={handleTabChange}
                className='w-full flex justify-center items-center'
            >
                <TabsList className='justify-center flex gap-2 items-center'>
                    {dashboardTabsConfig.map((tab) => (
                        <TabsTrigger
                            disabled={tab.disabled}
                            defaultValue={tab.default ? tab.value : currentTab}
                            key={tab.value}
                            value={tab.value}
                            className='text-xs sm:text-sm'
                        >
                            <tab.icon className='size-3.5 sm:size-4 mr-1 sm:mr-1.5' />
                            <span className='hidden xs:inline sm:inline'>{tab.label}</span>
                            <span className='xs:hidden sm:hidden'>{tab.label.substring(0, 4)}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </nav>
    );
}
