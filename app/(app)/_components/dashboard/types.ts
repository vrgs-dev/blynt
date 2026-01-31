import { Category } from '@/types/category';
import { LucideIcon } from 'lucide-react';

export const DASHBOARD_TABS = ['overview', 'transactions', 'calendar'] as const;

export type DashboardTab = (typeof DASHBOARD_TABS)[number];

export interface DashboardTabConfig {
    value: DashboardTab;
    label: string;
    icon: LucideIcon;
    disabled?: boolean;
    default?: boolean;
}

export interface BudgetItem {
    category: Category;
    spent: number;
    limit: number;
}

export interface StatCardData {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
}
