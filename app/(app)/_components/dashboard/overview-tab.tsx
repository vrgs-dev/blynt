'use client';

import { InputParse } from './input-parse';
import { StatsGrid } from './stats-cards';
import { BudgetOverview } from './budget-overview';
import { TransactionList } from './transaction-list';
import type { Transaction } from '@/types/transaction';
import { useCreateTransaction, useBudget, useOverview } from '@/lib/api/hooks/use-transaction';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions } from '@/lib/api/transaction';

export function OverviewTab() {
    const queryClient = useQueryClient();

    const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => getTransactions({ limit: 5, offset: 0, startDate: new Date().toISOString().split('T')[0] }),
    });

    const { data: budgetData, isLoading: isLoadingBudget } = useBudget();
    const { data: overviewData, isLoading: isLoadingOverview } = useOverview();

    const { mutate: createTransaction } = useCreateTransaction({
        onSuccess: async (data) => {
            console.log('Transaction created:', data);
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
            await queryClient.invalidateQueries({ queryKey: ['budget'] });
            await queryClient.invalidateQueries({ queryKey: ['overview'] });
            await queryClient.refetchQueries({ queryKey: ['transactions'] });
        },
        onError: (error) => {
            console.error('Error creating transaction:', error);
        },
    });

    const handleAddExpense = (transaction: Transaction, rawInput: string) => {
        createTransaction({
            transactions: [transaction],
            rawInput: rawInput,
        });
    };

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Stats Grid */}
            <StatsGrid
                stats={
                    overviewData?.stats ?? {
                        balance: { value: '$0.00', change: '0.0%', isPositive: true },
                        income: { value: '$0.00', change: '0.0%', isPositive: true },
                        expenses: { value: '$0.00', change: '0.0%', isPositive: true },
                        savings: { value: '$0.00', change: '0.0%', isPositive: true },
                    }
                }
                isLoading={isLoadingOverview}
            />

            {/* Natural Language Input */}
            <InputParse onAdd={handleAddExpense} />

            <div className='gap-4 sm:gap-6 grid lg:grid-cols-2'>
                <TransactionList
                    transactions={transactionsData?.transactions ?? []}
                    title='Recent Transactions'
                    isLoading={isLoadingTransactions}
                />
                <BudgetOverview budgets={budgetData?.budgets ?? []} isLoading={isLoadingBudget} />
            </div>
        </div>
    );
}

export default OverviewTab;
