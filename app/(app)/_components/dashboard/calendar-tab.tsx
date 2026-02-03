'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/lib/api/transaction';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isToday,
    differenceInDays,
} from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatCurrency, formatCurrencyCompact } from '@/lib/utils';
import type { Transaction } from '@/types/transaction';
import { useSubscription } from '@/lib/api/hooks/use-subscription';
import { subDays, startOfDay, addMonths, subMonths } from 'date-fns';
import { UpgradeDialog } from '@/components/upgrade-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { DateRange } from 'react-day-picker';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CalendarTab() {
    const today = startOfDay(new Date());
    const { data: subscription } = useSubscription();

    const historyDays = subscription?.plan.features.historyDays ?? 7;
    const maxStartDate = subDays(today, historyDays);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(today, Math.min(30, historyDays)),
        to: today,
    });
    const [currentDisplayMonth, setCurrentDisplayMonth] = useState<Date>(today);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [upgradeDetails, setUpgradeDetails] = useState<
        | {
              requestedDays: number;
              maxDays: number;
          }
        | undefined
    >();

    // Use date range for fetching transactions
    const startDate = dateRange?.from
        ? format(dateRange.from, 'yyyy-MM-dd')
        : subDays(today, 30).toISOString().split('T')[0];
    const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : today.toISOString().split('T')[0];

    // Use currentDisplayMonth for calendar display
    const displayMonth = currentDisplayMonth;
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const { data: transactionsData, isLoading } = useQuery({
        queryKey: ['transactions-calendar', startDate, endDate],
        queryFn: () => getTransactions({ limit: 100, offset: 0, startDate, endDate }),
    });

    const transactions = useMemo(() => transactionsData?.transactions ?? [], [transactionsData?.transactions]);

    // Group transactions by date
    const transactionsByDate = transactions.reduce(
        (acc, transaction) => {
            const date = transaction.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(transaction);
            return acc;
        },
        {} as Record<string, Transaction[]>,
    );

    // Generate calendar days
    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
        days.push(day);
        day = addDays(day, 1);
    }

    // Split days into weeks
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    // Calculate monthly statistics
    const monthlyStats = useMemo(() => {
        const monthTransactions = transactions.filter((t) => {
            const tDate = new Date(t.date);
            return isSameMonth(tDate, displayMonth);
        });

        const totalIncome = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalExpenses = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const balance = totalIncome - totalExpenses;

        // Group by category
        const categoryMap = new Map<string, { amount: number; count: number }>();
        monthTransactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                const category = t.category || 'Uncategorized';
                const current = categoryMap.get(category) || { amount: 0, count: 0 };
                categoryMap.set(category, {
                    amount: current.amount + Number(t.amount),
                    count: current.count + 1,
                });
            });

        const categories = Array.from(categoryMap.entries())
            .map(([name, data]) => ({
                name,
                amount: data.amount,
                count: data.count,
                percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
            }))
            .sort((a, b) => b.amount - a.amount);

        return {
            totalIncome,
            totalExpenses,
            balance,
            categories,
            transactionCount: monthTransactions.length,
        };
    }, [transactions, displayMonth]);

    // Handle date range selection with validation
    const handleDateRangeChange = (range: DateRange | undefined) => {
        if (!range?.from || !range?.to) {
            setDateRange(range);
            return;
        }

        const requestedDays = differenceInDays(range.to, range.from) + 1;

        // Check if the requested range exceeds the allowed days
        if (historyDays !== Infinity && requestedDays > historyDays) {
            setUpgradeDetails({
                requestedDays,
                maxDays: historyDays,
            });
            setShowUpgradeDialog(true);
            return;
        }

        // Check if the start date is before the allowed date
        if (historyDays !== Infinity && range.from < maxStartDate) {
            const daysDiff = differenceInDays(today, range.from);
            setUpgradeDetails({
                requestedDays: daysDiff,
                maxDays: historyDays,
            });
            setShowUpgradeDialog(true);
            return;
        }

        // Valid range, update it
        setDateRange(range);
        // Update display month to match the end of the range
        if (range.to) {
            setCurrentDisplayMonth(range.to);
        }
    };

    // Month navigation handlers
    const handlePreviousMonth = () => {
        const newMonth = subMonths(currentDisplayMonth, 1);
        const newMonthStart = startOfMonth(newMonth);

        // Check if going back would exceed history limit
        if (historyDays !== Infinity && newMonthStart < maxStartDate) {
            setUpgradeDetails({
                requestedDays: differenceInDays(today, newMonthStart),
                maxDays: historyDays,
            });
            setShowUpgradeDialog(true);
            return;
        }

        setCurrentDisplayMonth(newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = addMonths(currentDisplayMonth, 1);
        const newMonthEnd = endOfMonth(newMonth);

        // Don't allow navigating to future months
        if (newMonthEnd > today) {
            return;
        }

        setCurrentDisplayMonth(newMonth);
    };

    const handleToday = () => {
        setCurrentDisplayMonth(today);
    };

    // Check if we can navigate
    const canGoToPreviousMonth =
        historyDays === Infinity || startOfMonth(subMonths(currentDisplayMonth, 1)) >= maxStartDate;
    const canGoToNextMonth = endOfMonth(addMonths(currentDisplayMonth, 1)) <= today;

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Header with Date Range Filter */}
            <div className='flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4'>
                <div>
                    <h2 className='font-black text-foreground text-2xl sm:text-3xl'>Calendar</h2>
                    <p className='text-muted-foreground text-sm'>View transactions by date</p>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    {/* Month Navigation */}
                    <div className='flex items-center gap-1'>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={handlePreviousMonth}
                            disabled={!canGoToPreviousMonth}
                            className='size-9'
                        >
                            <ChevronLeft className='size-4' />
                        </Button>
                        <Button variant='outline' onClick={handleToday} className='px-3 h-9 font-semibold text-sm'>
                            Today
                        </Button>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={handleNextMonth}
                            disabled={!canGoToNextMonth}
                            className='size-9'
                        >
                            <ChevronRight className='size-4' />
                        </Button>
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
                                    if (date > today) return true;
                                    // Disable dates before the allowed history limit
                                    if (historyDays !== Infinity && date < maxStartDate) return true;
                                    return false;
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Calendar Grid with Sidebar */}
            <div className='gap-4 grid grid-cols-1 xl:grid-cols-[1fr_320px]'>
                <Card className='p-4 sm:p-6'>
                    {isLoading ? (
                        <div className='space-y-4'>
                            <Skeleton className='w-full h-12' />
                            <Skeleton className='w-full h-96' />
                        </div>
                    ) : (
                        <div className='w-full'>
                            {/* Week Days Header */}
                            <div className='gap-px grid grid-cols-7 mb-px'>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div
                                        key={day}
                                        className='bg-muted/30 p-2 border-border font-semibold text-muted-foreground text-xs sm:text-sm text-center uppercase'
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Weeks */}
                            <div className='gap-px grid grid-rows-[repeat(auto-fill,minmax(120px,1fr))]'>
                                {weeks.map((week, weekIdx) => (
                                    <div key={weekIdx} className='gap-px grid grid-cols-7'>
                                        {week.map((day, dayIdx) => {
                                            const dateStr = format(day, 'yyyy-MM-dd');
                                            const dayTransactions = transactionsByDate[dateStr] ?? [];
                                            const isCurrentMonth = isSameMonth(day, displayMonth);
                                            const isTodayDate = isToday(day);
                                            const isInRange =
                                                dateRange?.from &&
                                                dateRange?.to &&
                                                day >= dateRange.from &&
                                                day <= dateRange.to;

                                            // Calculate daily totals
                                            const dayIncome = dayTransactions
                                                .filter((t) => t.type === 'income')
                                                .reduce((sum, t) => sum + Number(t.amount), 0);

                                            const dayExpenses = dayTransactions
                                                .filter((t) => t.type === 'expense')
                                                .reduce((sum, t) => sum + Number(t.amount), 0);

                                            return (
                                                <div
                                                    key={dayIdx}
                                                    className={cn(
                                                        'relative bg-card p-2 border border-border min-h-[120px] sm:min-h-[140px]',
                                                        !isCurrentMonth && 'bg-muted/10',
                                                        !isInRange && 'opacity-40',
                                                    )}
                                                >
                                                    {/* Day Number */}
                                                    <div className='flex justify-between items-start mb-2'>
                                                        <div
                                                            className={cn(
                                                                'flex justify-center items-center rounded-full size-6 sm:size-7 font-semibold text-xs sm:text-sm',
                                                                isTodayDate && 'bg-primary text-primary-foreground',
                                                                !isTodayDate && isCurrentMonth && 'text-foreground',
                                                                !isTodayDate &&
                                                                    !isCurrentMonth &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        >
                                                            {format(day, 'd')}
                                                        </div>
                                                    </div>

                                                    {/* Transactions */}
                                                    {isInRange && dayTransactions.length > 0 && (
                                                        <div className='space-y-1'>
                                                            {dayTransactions.slice(0, 2).map((transaction) => (
                                                                <div
                                                                    key={transaction.id}
                                                                    className={cn(
                                                                        'px-1.5 py-0.5 rounded font-medium text-[9px] sm:text-[10px] truncate',
                                                                        transaction.type === 'income'
                                                                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-l-2 border-emerald-600'
                                                                            : 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border-l-2 border-rose-600',
                                                                    )}
                                                                    title={`${transaction.description} - $${formatCurrency(Number(transaction.amount))}`}
                                                                >
                                                                    {transaction.description}
                                                                </div>
                                                            ))}
                                                            {dayTransactions.length > 2 && (
                                                                <div className='px-1.5 py-0.5 font-medium text-[9px] text-muted-foreground'>
                                                                    +{dayTransactions.length - 2}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Daily Summary (bottom right) */}
                                                    {isInRange && dayTransactions.length > 0 && (
                                                        <div className='right-1 bottom-1 absolute text-[8px] sm:text-[9px]'>
                                                            <div className='flex flex-col gap-0.5 font-bold text-right'>
                                                                {dayIncome > 0 && (
                                                                    <span className='text-emerald-600 whitespace-nowrap'>
                                                                        +{formatCurrencyCompact(dayIncome)}
                                                                    </span>
                                                                )}
                                                                {dayExpenses > 0 && (
                                                                    <span className='text-rose-600 whitespace-nowrap'>
                                                                        -{formatCurrencyCompact(dayExpenses)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                {/* Monthly Summary Sidebar */}
                <Card className='xl:top-4 xl:sticky p-4 h-fit'>
                    <div className='space-y-4'>
                        {/* Month Header */}
                        <div>
                            <h3 className='font-bold text-lg'>{format(displayMonth, 'MMMM yyyy')}</h3>
                            <p className='text-muted-foreground text-sm'>
                                {monthlyStats.transactionCount} transactions
                            </p>
                        </div>

                        {/* Monthly Totals */}
                        <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                                <span className='text-muted-foreground text-sm'>Income</span>
                                <span className='font-semibold text-emerald-600'>
                                    +${formatCurrencyCompact(monthlyStats.totalIncome)}
                                </span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <span className='text-muted-foreground text-sm'>Expenses</span>
                                <span className='font-semibold text-rose-600'>
                                    -${formatCurrencyCompact(monthlyStats.totalExpenses)}
                                </span>
                            </div>
                            <div className='pt-2 border-border border-t'>
                                <div className='flex justify-between items-center'>
                                    <span className='font-semibold text-sm'>Balance</span>
                                    <span
                                        className={cn(
                                            'font-bold',
                                            monthlyStats.balance >= 0 ? 'text-emerald-600' : 'text-rose-600',
                                        )}
                                    >
                                        {monthlyStats.balance >= 0 ? '+' : ''}$
                                        {formatCurrencyCompact(Math.abs(monthlyStats.balance))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Categories Breakdown */}
                        {monthlyStats.categories.length > 0 && (
                            <div className='space-y-3'>
                                <h4 className='font-semibold text-sm'>Expenses by Category</h4>
                                <ScrollArea className='pr-2 h-[300px]'>
                                    <div className='space-y-3'>
                                        {monthlyStats.categories.map((category) => (
                                            <div key={category.name} className='space-y-1'>
                                                <div className='flex justify-between items-center'>
                                                    <span className='font-medium text-sm capitalize'>
                                                        {category.name}
                                                    </span>
                                                    <span className='text-muted-foreground text-xs'>
                                                        {category.count}
                                                    </span>
                                                </div>
                                                <div className='flex justify-between items-center gap-2'>
                                                    <div className='relative flex-1 bg-muted rounded-full h-2'>
                                                        <div
                                                            className='left-0 absolute inset-y-0 bg-rose-600 rounded-full'
                                                            style={{ width: `${Math.min(category.percentage, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className='font-semibold text-sm'>
                                                        ${formatCurrencyCompact(category.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                </Card>
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

export default CalendarTab;
