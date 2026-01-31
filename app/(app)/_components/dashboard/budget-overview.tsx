'use client';

import { cn } from '@/lib/utils';
import type { BudgetItem } from './types';
import { CATEGORY_COLORS, DEFAULT_COLORS } from '@/constants/category';
import { Category } from '@/types/category';

interface BudgetOverviewProps {
    budgets: BudgetItem[];
    title?: string;
}
interface BudgetBarProps {
    budget: BudgetItem;
}

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

function BudgetBar({ budget }: BudgetBarProps) {
    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
    const isOverBudget = percentage >= 100;
    const isWarning = percentage >= 80 && percentage < 100;

    const colors = CATEGORY_COLORS[budget.category as Category] || DEFAULT_COLORS;

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
                        isOverBudget ? 'bg-destructive' : isWarning ? 'bg-amber-500' : colors.bg,
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
