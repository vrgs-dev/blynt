'use client';

import { cn } from '@/lib/utils';
import type { BudgetItem } from './types';

interface BudgetOverviewProps {
    budgets: BudgetItem[];
    title?: string;
}

const CATEGORY_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
    'Food & Dining': { bar: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-600' },
    Food: { bar: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-600' },
    Transportation: { bar: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
    Transport: { bar: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
    Entertainment: { bar: 'bg-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' },
    Shopping: { bar: 'bg-pink-500', bg: 'bg-pink-100', text: 'text-pink-600' },
    Utilities: { bar: 'bg-amber-500', bg: 'bg-amber-100', text: 'text-amber-600' },
    Healthcare: { bar: 'bg-rose-500', bg: 'bg-rose-100', text: 'text-rose-600' },
};

const DEFAULT_COLORS = { bar: 'bg-primary', bg: 'bg-primary/20', text: 'text-primary' };

export function BudgetOverview({ budgets, title = 'Budget Overview' }: BudgetOverviewProps) {
    return (
        <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 sm:p-5 border-2 border-border rounded-2xl'>
            <h3 className='mb-4 sm:mb-5 font-bold text-foreground text-sm sm:text-base'>{title}</h3>

            <div className='space-y-4 sm:space-y-5'>
                {budgets.map((budget) => (
                    <BudgetBar key={budget.category} budget={budget} />
                ))}
            </div>
        </div>
    );
}

interface BudgetBarProps {
    budget: BudgetItem;
}

function BudgetBar({ budget }: BudgetBarProps) {
    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
    const isOverBudget = percentage >= 100;
    const isWarning = percentage >= 80 && percentage < 100;

    const colors = CATEGORY_COLORS[budget.category] || DEFAULT_COLORS;

    return (
        <div>
            <div className='flex justify-between items-center gap-2 mb-2'>
                <p className='font-semibold text-foreground text-xs sm:text-sm'>{budget.category}</p>
                <div className='flex items-center gap-1.5'>
                    <span
                        className={cn(
                            'font-bold text-xs sm:text-sm',
                            isOverBudget ? 'text-destructive' : isWarning ? 'text-amber-600' : 'text-muted-foreground',
                        )}
                    >
                        ${budget.spent.toLocaleString()}
                    </span>
                    <span className='text-muted-foreground/50 text-xs'>/</span>
                    <span className='text-muted-foreground text-xs sm:text-sm'>${budget.limit.toLocaleString()}</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className='relative bg-muted rounded-full h-2.5 sm:h-3 overflow-hidden'>
                <div
                    className={cn(
                        'left-0 absolute inset-y-0 rounded-full transition-all duration-700 ease-out',
                        isOverBudget ? 'bg-destructive' : isWarning ? 'bg-amber-500' : colors.bar,
                    )}
                    style={{ width: `${percentage}%` }}
                />

                {/* Animated shine effect */}
                <div
                    className='left-0 absolute inset-y-0 bg-linear-to-r from-transparent via-white/20 to-transparent rounded-full animate-shimmer'
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Percentage indicator */}
            <div className='flex justify-end mt-1'>
                <span
                    className={cn(
                        'font-bold text-[10px]',
                        isOverBudget ? 'text-destructive' : isWarning ? 'text-amber-600' : 'text-muted-foreground',
                    )}
                >
                    {percentage.toFixed(0)}%
                </span>
            </div>
        </div>
    );
}

export default BudgetOverview;
