import { CalendarIcon, HomeIcon, ReceiptTextIcon } from 'lucide-react';
import type { DashboardTabConfig } from './types';

export const dashboardTabsConfig: DashboardTabConfig[] = [
    {
        value: 'overview',
        label: 'Overview',
        icon: HomeIcon,
    },
    {
        value: 'transactions',
        label: 'Transactions',
        icon: ReceiptTextIcon,
    },
    {
        value: 'calendar',
        label: 'Calendar',
        icon: CalendarIcon,
        disabled: true,
    },
];
