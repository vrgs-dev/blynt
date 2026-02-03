'use client';

import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon?: 'balance' | 'income' | 'expense' | 'savings';
}

const ICONS = {
    balance: Wallet,
    income: ArrowUpCircle,
    expense: ArrowDownCircle,
    savings: PiggyBank,
};

const ICON_STYLES = {
    balance: 'bg-primary/10 text-primary border-primary/20',
    income: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    expense: 'bg-rose-50 text-rose-600 border-rose-200',
    savings: 'bg-amber-50 text-amber-600 border-amber-200',
};

export function StatCard({ title, value, change, isPositive, icon = 'balance' }: StatCardProps) {
    const Icon = ICONS[icon];
    const iconStyle = ICON_STYLES[icon];

    return (
        <div className='group bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 hover:shadow-[4px_4px_0px_0px] hover:shadow-foreground/8 p-4 sm:p-5 border-2 border-border rounded-2xl transition-all'>
            <div className='flex justify-between items-start gap-2 mb-3'>
                <h3 className='font-semibold text-muted-foreground text-xs sm:text-sm truncate uppercase tracking-wide'>
                    {title}
                </h3>
                <div
                    className={cn(
                        'p-1.5 sm:p-2 border-2 rounded-lg group-hover:scale-110 transition-transform shrink-0',
                        iconStyle,
                    )}
                >
                    <Icon className='size-3.5 sm:size-4' />
                </div>
            </div>

            <p
                className='mb-1 font-black text-foreground text-lg sm:text-xl md:text-2xl truncate tracking-tight'
                title={value}
            >
                {value}
            </p>

            <div className='flex flex-wrap items-center gap-1.5'>
                {isPositive ? (
                    <TrendingUp className='size-3.5 text-emerald-500 shrink-0' />
                ) : (
                    <TrendingDown className='size-3.5 text-rose-500 shrink-0' />
                )}
                <span
                    className={cn(
                        'font-bold text-[10px] sm:text-xs shrink-0',
                        isPositive ? 'text-emerald-600' : 'text-rose-600',
                    )}
                >
                    {change}
                </span>
                <span className='text-[10px] text-muted-foreground sm:text-xs'>from last month</span>
            </div>
        </div>
    );
}

interface StatsGridProps {
    stats: {
        balance: { value: string; change: string; isPositive: boolean };
        income: { value: string; change: string; isPositive: boolean };
        expenses: { value: string; change: string; isPositive: boolean };
        savings: { value: string; change: string; isPositive: boolean };
    };
    isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
    if (isLoading) {
        return (
            <div className='gap-3 sm:gap-4 grid grid-cols-2 lg:grid-cols-4'>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        );
    }

    return (
        <div className='gap-3 sm:gap-4 grid grid-cols-2 lg:grid-cols-4'>
            <StatCard
                title='Total Balance'
                value={stats.balance.value}
                change={stats.balance.change}
                isPositive={stats.balance.isPositive}
                icon='balance'
            />
            <StatCard
                title='Income'
                value={stats.income.value}
                change={stats.income.change}
                isPositive={stats.income.isPositive}
                icon='income'
            />
            <StatCard
                title='Expenses'
                value={stats.expenses.value}
                change={stats.expenses.change}
                isPositive={stats.expenses.isPositive}
                icon='expense'
            />
            <StatCard
                title='Savings'
                value={stats.savings.value}
                change={stats.savings.change}
                isPositive={stats.savings.isPositive}
                icon='savings'
            />
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 sm:p-5 border-2 border-border rounded-2xl'>
            <div className='flex justify-between items-start gap-2 mb-3'>
                <Skeleton className='w-24 sm:w-28 h-3.5 sm:h-4' />
                <Skeleton className='rounded-lg size-8 sm:size-9' />
            </div>

            <Skeleton className='mb-1 w-28 sm:w-36 md:w-40 h-7 sm:h-9 md:h-10' />

            <div className='flex items-center gap-1.5'>
                <Skeleton className='rounded-full size-3.5' />
                <Skeleton className='w-12 sm:w-14 h-3 sm:h-3.5' />
                <Skeleton className='w-20 sm:w-24 h-3 sm:h-3.5' />
            </div>
        </div>
    );
}

export default StatsGrid;
