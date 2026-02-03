import { redirect } from 'next/navigation';
import { dashboardTabsConfig } from '../_components/dashboard/config';
import { DashboardContent } from '../_components/dashboard/dashboard-content';
import type { DashboardTab } from '../_components/dashboard/types';

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const params = await searchParams;
    const activeTab = (params.tab as DashboardTab) || 'overview';

    if (
        !dashboardTabsConfig.some((tab) => tab.value === activeTab) ||
        dashboardTabsConfig.find((tab) => tab.value === activeTab)?.disabled
    ) {
        redirect(`?tab=${dashboardTabsConfig[0].value}`);
    }

    return (
        <div className='w-full h-full'>
            <div className='mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 max-w-7xl'>
                <DashboardContent activeTab={activeTab} />
            </div>
        </div>
    );
}
