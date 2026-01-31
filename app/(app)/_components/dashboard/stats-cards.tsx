'use client';

import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className='bg-card border-2 border-border rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px] shadow-foreground/5 hover:shadow-[4px_4px_0px_0px] hover:shadow-foreground/8 transition-all group'>
            <div className='flex items-start justify-between gap-2 mb-3'>
                <h3 className='text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
                    {title}
                </h3>
                <div
                    className={cn(
                        'p-1.5 sm:p-2 rounded-lg border-2 transition-transform group-hover:scale-110',
                        iconStyle,
                    )}
                >
                    <Icon className='size-3.5 sm:size-4' />
                </div>
            </div>

            <p className='text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight mb-1'>{value}</p>

            <div className='flex items-center gap-1.5'>
                {isPositive ? (
                    <TrendingUp className='size-3.5 text-emerald-500' />
                ) : (
                    <TrendingDown className='size-3.5 text-rose-500' />
                )}
                <span
                    className={cn(
                        'text-[10px] sm:text-xs font-bold',
                        isPositive ? 'text-emerald-600' : 'text-rose-600',
                    )}
                >
                    {change}
                </span>
                <span className='text-[10px] sm:text-xs text-muted-foreground'>from last month</span>
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
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className='grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4'>
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

export default StatsGrid;
