'use client';

import { useState } from 'react';
import { InputParse } from './input-parse';
import { StatsGrid } from './stats-cards';
import { BudgetOverview } from './budget-overview';
import { TransactionList } from './transaction-list';
import type { Transaction } from '@/types/transaction';
import { useCreateTransaction, useBudget, useOverview } from '@/lib/api/hooks/use-transaction';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions } from '@/lib/api/transaction';
import { subDays, format, differenceInDays, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { UpgradeDialog } from '@/components/upgrade-dialog';
import { useSubscription } from '@/lib/api/hooks/use-subscription';

export function OverviewTab() {
    const queryClient = useQueryClient();
    const today = startOfDay(new Date());
    const { data: subscription } = useSubscription();

    const historyDays = subscription?.plan.features.historyDays ?? 7;
    const maxStartDate = subDays(today, historyDays);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(today, Math.min(7, historyDays)),
        to: today,
    });
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [upgradeDetails, setUpgradeDetails] = useState<
        | {
              requestedDays: number;
              maxDays: number;
          }
        | undefined
    >();

    const startDate = dateRange?.from
        ? format(dateRange.from, 'yyyy-MM-dd')
        : subDays(today, 7).toISOString().split('T')[0];
    const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : today.toISOString().split('T')[0];

    // Handle date range selection with validation
    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (!range?.from || !range?.to) {
            setDateRange(range);
            return;
        }

        const requestedDays = differenceInDays(range.to, range.from) + 1;

        // Check if the requested range exceeds the allowed days
        if (historyDays !== Infinity && requestedDays > historyDays) {
            // Show upgrade dialog
            setUpgradeDetails({
                requestedDays,
                maxDays: historyDays,
            });
            setShowUpgradeDialog(true);
            // Don't update the date range
            return;
        }

        // Check if the start date is before the allowed date
        if (historyDays !== Infinity && range.from < maxStartDate) {
            // Show upgrade dialog
            const daysDiff = differenceInDays(today, range.from);
            setUpgradeDetails({
                requestedDays: daysDiff,
                maxDays: historyDays,
            });
            setShowUpgradeDialog(true);
            // Don't update the date range
            return;
        }

        // Valid range, update it
        setDateRange(range);
    };

    const dateParams = { startDate, endDate };

    const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['transactions', startDate, endDate],
        queryFn: () => getTransactions({ limit: 5, offset: 0, startDate, endDate }),
    });

    const { data: budgetData, isLoading: isLoadingBudget } = useBudget(dateParams);
    const { data: overviewData, isLoading: isLoadingOverview } = useOverview(dateParams);

    const { mutate: createTransaction } = useCreateTransaction({
        onSuccess: async (data) => {
            console.log('Transaction created:', data);
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
            await queryClient.invalidateQueries({ queryKey: ['budget'] });
            await queryClient.invalidateQueries({ queryKey: ['overview'] });
            await queryClient.refetchQueries({ queryKey: ['transactions'] });
            await queryClient.refetchQueries({ queryKey: ['subscription'] });
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
            {/* Header with Date Filter */}
            <div className='flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4'>
                <div>
                    <h2 className='font-black text-foreground text-2xl sm:text-3xl'>Overview</h2>
                    <p className='text-muted-foreground text-sm'>
                        Get a comprehensive view of your financial health and activity
                    </p>
                </div>

                {/* Date Range Picker */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            className={cn(
                                'justify-start border-2 font-semibold text-left',
                                !dateRange && 'text-muted-foreground',
                            )}
                        >
                            <CalendarIcon className='mr-2 size-4' />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(dateRange.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='p-0 w-auto' align='end'>
                        <Calendar
                            mode='range'
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={handleDateRangeChange}
                            numberOfMonths={2}
                            disabled={(date) => {
                                // Disable future dates
                                if (date > today) return true;
                                // Disable dates before the allowed history limit
                                if (historyDays !== Infinity && date < maxStartDate) return true;
                                return false;
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Stats Grid */}
            <StatsGrid
                stats={
                    overviewData?.stats ?? {
                        balance: { value: '$0.00', change: '0.0%', isPositive: true },
                        income: { value: '$0.00', change: '0.0%', isPositive: true },
                        expenses: { value: '$0.00', change: '0.0%', isPositive: true },
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

            {/* Upgrade Dialog */}
            <UpgradeDialog
                open={showUpgradeDialog}
                onOpenChange={setShowUpgradeDialog}
                reason='date_range'
                details={upgradeDetails}
            />
        </div>
    );
}

export default OverviewTab;
