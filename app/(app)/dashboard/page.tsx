import { redirect } from 'next/navigation';
import { dashboardTabsConfig } from '../_components/dashboard/config';
import { DashboardContent } from '../_components/dashboard/dashboard-content';
import type { DashboardTab } from '../_components/dashboard/types';

interface DashboardPageProps {
    searchParams: Promise<{ tab?: string }>;
}

const TAB_HEADERS: Record<DashboardTab, { title: string; description: string }> = {
    overview: {
        title: 'Overview',
        description: 'Get a comprehensive view of your financial health and activity',
    },
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
    const header = TAB_HEADERS[activeTab];

    if (
        !dashboardTabsConfig.some((tab) => tab.value === activeTab) ||
        dashboardTabsConfig.find((tab) => tab.value === activeTab)?.disabled
    ) {
        redirect(`?tab=${dashboardTabsConfig[0].value}`);
    }

    return (
        <div className='w-full h-full overflow-auto'>
            <div className='container mx-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6'>
                <div className='mb-6 sm:mb-8'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight'>{header.title}</h1>
                    <p className='text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2'>{header.description}</p>
                </div>
                <DashboardContent activeTab={activeTab} />
            </div>
        </div>
    );
}
