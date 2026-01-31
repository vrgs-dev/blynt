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

// Transaction types
export type TransactionType = 'income' | 'expense';
export type Category =
    | 'Food'
    | 'Transport'
    | 'Utilities'
    | 'Entertainment'
    | 'Healthcare'
    | 'Shopping'
    | 'Salary'
    | 'Other';

export interface Transaction {
    id: string;
    amount: number;
    currency: string;
    category: Category;
    merchant: string;
    date: string;
    type: TransactionType;
    note?: string;
}

export interface BudgetItem {
    category: string;
    spent: number;
    limit: number;
}

export interface StatCardData {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
}
