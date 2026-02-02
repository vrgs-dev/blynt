'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboardTabsConfig } from '../dashboard/config';
import type { DashboardTab } from '../dashboard/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function DashboardNavigationTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTab = (searchParams.get('tab') as DashboardTab) || dashboardTabsConfig[0].value;

    const handleTabChange = (value: string) => {
        router.push(`/dashboard?tab=${value}`);
    };

    return (
        <nav className='flex flex-1 justify-center mx-auto min-w-0 max-w-md'>
            <Tabs
                value={currentTab}
                onValueChange={handleTabChange}
                className='flex justify-center items-center w-full'
            >
                <TabsList className='flex justify-center items-center gap-1 sm:gap-1.5 bg-muted/50 p-2 border border-border/50 rounded-md'>
                    {dashboardTabsConfig.map((tab) => {
                        const trigger = (
                            <TabsTrigger
                                disabled={tab.disabled}
                                value={tab.value}
                                className='data-[state=active]:bg-card data-[state=active]:shadow-[2px_2px_0px_0px] data-[state=active]:shadow-foreground/5 p-3 data-[state=active]:border data-[state=active]:border-border rounded-md font-semibold text-[10px] xs:text-xs sm:text-sm transition-all'
                            >
                                <tab.icon className='size-3 sm:size-3.5 md:size-4 shrink-0' />
                                <span className='hidden xs:inline ml-1 sm:ml-1.5'>{tab.label}</span>
                            </TabsTrigger>
                        );

                        if (tab.disabled) {
                            return (
                                <Tooltip key={tab.value}>
                                    <TooltipTrigger asChild>
                                        <span tabIndex={0} className='outline-none'>
                                            {trigger}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>Coming soon</TooltipContent>
                                </Tooltip>
                            );
                        }

                        return (
                            <div key={tab.value} className='contents'>
                                {trigger}
                            </div>
                        );
                    })}
                </TabsList>
            </Tabs>
        </nav>
    );
}
