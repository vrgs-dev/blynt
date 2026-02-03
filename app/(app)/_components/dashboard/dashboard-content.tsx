'use client';

import { OverviewTab } from './overview-tab';
import { TransactionsTab } from './transactions-tab';
import { CalendarTab } from './calendar-tab';
import type { DashboardTab } from './types';

const TAB_COMPONENTS: Record<DashboardTab, React.ComponentType> = {
    overview: OverviewTab,
    transactions: TransactionsTab,
    calendar: CalendarTab,
};

interface DashboardContentProps {
    activeTab: DashboardTab;
}

export function DashboardContent({ activeTab }: DashboardContentProps) {
    const TabComponent = TAB_COMPONENTS[activeTab];
    return <TabComponent />;
}
