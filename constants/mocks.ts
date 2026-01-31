import type { BudgetItem } from '@/app/(app)/_components/dashboard/types';
import type { Transaction } from '@/types/transaction';

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        amount: 4.5,
        currency: 'USD',
        category: 'Food',
        description: 'Coffee Shop',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
    },
    {
        id: '2',
        amount: 3500,
        currency: 'USD',
        category: 'Salary',
        description: 'Salary Deposit',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        type: 'income',
    },
    {
        id: '3',
        amount: 87.32,
        currency: 'USD',
        category: 'Food',
        description: 'Grocery Store',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        type: 'expense',
    },
    {
        id: '4',
        amount: 15.99,
        currency: 'USD',
        category: 'Entertainment',
        description: 'Netflix Subscription',
        date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        type: 'expense',
    },
    {
        id: '5',
        amount: 45.0,
        currency: 'USD',
        category: 'Transport',
        description: 'Shell Gas Station',
        date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
        type: 'expense',
    },
];

export const MOCK_STATS = {
    balance: { value: '$12,345.67', change: '+20.1%', isPositive: true },
    income: { value: '$8,234.50', change: '+15.3%', isPositive: true },
    expenses: { value: '$4,111.17', change: '+7.2%', isPositive: false },
    savings: { value: '$4,123.33', change: '+33.4%', isPositive: true },
};

export const MOCK_BUDGETS: BudgetItem[] = [
    { category: 'Food & Dining', spent: 420, limit: 500 },
    { category: 'Transportation', spent: 150, limit: 300 },
    { category: 'Entertainment', spent: 95, limit: 200 },
    { category: 'Shopping', spent: 280, limit: 250 },
];
