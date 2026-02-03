import { redirect } from 'next/navigation';
import { dashboardTabsConfig } from '../_components/dashboard/config';
import { DashboardContent } from '../_components/dashboard/dashboard-content';
import type { DashboardTab } from '../_components/dashboard/types';

interface DashboardPageProps {
    searchParams: Promise<{ tab?: string }>;
}

const TAB_HEADERS: Record<Exclude<DashboardTab, 'overview'>, { title: string; description: string }> = {
    transactions: {
        title: 'Transactions',
        description: 'View and manage all your financial transactions',
    },
    calendar: {
        title: 'Calendar',
        description: 'View and manage your financial calendar events',
    },
};

export default async function Dashboard({ searchParams }: DashboardPageProps) {
    const params = await searchParams;
    const activeTab = (params.tab as DashboardTab) || 'overview';
    const header = activeTab !== 'overview' ? TAB_HEADERS[activeTab as Exclude<DashboardTab, 'overview'>] : undefined;

    if (
        !dashboardTabsConfig.some((tab) => tab.value === activeTab) ||
        dashboardTabsConfig.find((tab) => tab.value === activeTab)?.disabled
    ) {
        redirect(`?tab=${dashboardTabsConfig[0].value}`);
    }

    return (
        <div className='w-full h-full'>
            <div className='mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 max-w-7xl'>
                {header && (
                    <div className='mb-6 sm:mb-8'>
                        <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight'>{header.title}</h1>
                        <p className='mt-1 sm:mt-2 text-muted-foreground text-sm sm:text-base'>{header.description}</p>
                    </div>
                )}
                <DashboardContent activeTab={activeTab} />
            </div>
        </div>
    );
}
