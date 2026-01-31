'use client';

import { useState } from 'react';
import { InputParse } from './input-parse';
import { StatsGrid } from './stats-cards';
import { BudgetOverview } from './budget-overview';
import { RecentActivity } from './recent-activity';
import type { Transaction, TransactionType } from './types';
import { MOCK_STATS, MOCK_TRANSACTIONS, MOCK_BUDGETS } from '@/constants/mocks';

export function OverviewTab() {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

    const handleAddExpense = (expense: {
        amount: number;
        category: string;
        merchant: string;
        date: string;
        type: TransactionType;
        currency: string;
        note?: string;
    }) => {
        const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            amount: expense.amount,
            category: expense.category as Transaction['category'],
            merchant: expense.merchant,
            date: expense.date,
            type: expense.type,
            currency: expense.currency,
            note: expense.note,
        };

        setTransactions((prev) => [newTransaction, ...prev]);
    };

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Stats Grid */}
            <StatsGrid stats={MOCK_STATS} />

            {/* Natural Language Input */}
            <InputParse onAdd={handleAddExpense} />

            <div className='gap-4 sm:gap-6 grid lg:grid-cols-2'>
                <RecentActivity transactions={transactions} limit={5} />
                <BudgetOverview budgets={MOCK_BUDGETS} />
            </div>
        </div>
    );
}

export default OverviewTab;
