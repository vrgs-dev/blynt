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
        <nav className='flex-1 flex justify-center max-w-md mx-auto min-w-0'>
            <Tabs
                value={currentTab}
                onValueChange={handleTabChange}
                className='w-full flex justify-center items-center'
            >
                <TabsList className='bg-muted/50 border border-border/50 justify-center flex gap-1 sm:gap-1.5 items-center p-1 rounded-xl'>
                    {dashboardTabsConfig.map((tab) => (
                        <TabsTrigger
                            disabled={tab.disabled}
                            defaultValue={tab.default ? tab.value : currentTab}
                            key={tab.value}
                            value={tab.value}
                            className='text-[10px] xs:text-xs sm:text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px] data-[state=active]:shadow-foreground/5 data-[state=active]:border data-[state=active]:border-border px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all'
                        >
                            <tab.icon className='size-3 sm:size-3.5 md:size-4 shrink-0' />
                            <span className='hidden xs:inline ml-1 sm:ml-1.5'>{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </nav>
    );
}
