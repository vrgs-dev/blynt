'use client';

import {
    Trash2,
    ShoppingBag,
    Coffee,
    Zap,
    Heart,
    Utensils,
    Car,
    Banknote,
    HelpCircle,
    Sparkles,
    Clock,
    Pencil,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/types/transaction';
import { Category } from '@/types/category';
import { formatDate } from '@/lib/date';
import { CATEGORY_COLORS } from '@/constants/category';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpenseListProps {
    transactions: Transaction[];
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (id: string) => void;
    title?: string;
    showEmpty?: boolean;
    isLoading?: boolean;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
    Food: <Utensils className='size-5' />,
    Transport: <Car className='size-5' />,
    Utilities: <Zap className='size-5' />,
    Entertainment: <Coffee className='size-5' />,
    Healthcare: <Heart className='size-5' />,
    Shopping: <ShoppingBag className='size-5' />,
    Salary: <Banknote className='size-5' />,
    Other: <HelpCircle className='size-5' />,
};

export function TransactionList({
    transactions,
    onEdit,
    onDelete,
    title,
    showEmpty = true,
    isLoading,
}: ExpenseListProps) {
    if (isLoading) {
        return <LoadingState title={title} />;
    }

    if (transactions.length === 0 && showEmpty) {
        return <EmptyState />;
    }

    if (transactions.length === 0) {
        return null;
    }

    return (
        <div className='space-y-3'>
            {title && <h3 className='px-1 font-bold text-foreground text-sm sm:text-base'>{title}</h3>}
            <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 border-2 border-border rounded-2xl overflow-hidden'>
                <div className='divide-y divide-border'>
                    {transactions.map((transaction, index) => (
                        <TransactionRow
                            key={transaction.id}
                            transaction={transaction}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isFirst={index === 0}
                            isLast={index === transactions.length - 1}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface TransactionRowProps {
    transaction: Transaction;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (id: string) => void;
    isFirst?: boolean;
    isLast?: boolean;
}

function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
    const styles = CATEGORY_COLORS[transaction.category as Category] || CATEGORY_COLORS.Other;
    const icon = CATEGORY_ICONS[transaction.category as Category] || CATEGORY_ICONS.Other;

    return (
        <div className='group flex justify-between items-center hover:bg-muted/30 p-3 sm:p-4 transition-colors'>
            <div className='flex flex-1 items-center gap-3 sm:gap-4 min-w-0'>
                {/* Category Icon */}
                <div
                    className={cn(
                        'p-2.5 sm:p-3 border-2 rounded-xl group-hover:scale-105 transition-transform shrink-0',
                        styles.bg,
                        styles.text,
                        styles.border,
                    )}
                >
                    {icon}
                </div>

                {/* Details */}
                <div className='flex-1 min-w-0'>
                    <h4 className='font-bold text-foreground text-sm sm:text-base truncate'>
                        {transaction.description}
                    </h4>
                    <div className='flex items-center gap-2 mt-0.5'>
                        <span className='font-medium text-[10px] text-muted-foreground sm:text-xs'>
                            {formatDate(transaction.date)}
                        </span>
                        <span className='bg-muted-foreground/30 rounded-full size-1' />
                        <span
                            className={cn(
                                'px-1.5 py-0.5 rounded font-semibold text-[10px] sm:text-xs',
                                styles.bg,
                                styles.text,
                            )}
                        >
                            {transaction.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* Amount & Actions */}
            <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
                <div className='min-w-0 text-right'>
                    <p
                        className={cn(
                            'font-black text-sm sm:text-base md:text-lg truncate tracking-tight',
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600',
                        )}
                    >
                        ${formatCurrency(transaction.amount)}
                    </p>
                    {transaction.description && (
                        <p className='max-w-[100px] sm:max-w-[120px] text-[10px] text-muted-foreground truncate'>
                            {transaction.description}
                        </p>
                    )}
                </div>

                <div className='flex items-center gap-1 opacity-0 focus-within:opacity-100 group-hover:opacity-100 transition-opacity'>
                    {onEdit && (
                        <button
                            onClick={() => onEdit(transaction)}
                            className='hover:bg-primary/10 p-2 rounded-lg text-muted-foreground/50 hover:text-primary transition-all'
                            aria-label='Edit transaction'
                        >
                            <Pencil className='size-4' />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(transaction.id ?? 'unknown')}
                            className='hover:bg-destructive/10 p-2 rounded-lg text-muted-foreground/50 hover:text-destructive transition-all'
                            aria-label='Delete transaction'
                        >
                            <Trash2 className='size-4' />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className='flex flex-col items-center bg-card p-8 sm:p-10 border-2 border-border border-dashed rounded-2xl text-center animate-in duration-500 fade-in'>
            {/* Animated Icon */}
            <div className='relative mb-6'>
                <div className='absolute -inset-4 bg-primary/5 rounded-full animate-pulse' />
                <div className='relative bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-5 sm:p-6 border-2 border-border rounded-2xl'>
                    <Clock className='size-10 sm:size-12 text-primary' />
                </div>
                <Sparkles className='-top-1 -right-1 absolute size-5 sm:size-6 text-accent animate-pulse' />
            </div>

            <h3 className='mb-2 font-bold text-foreground text-lg sm:text-xl'>Your journey starts here</h3>
            <p className='mb-6 max-w-sm text-muted-foreground text-sm sm:text-base leading-relaxed'>
                Try typing{' '}
                <span className='font-semibold text-primary italic'>&quot;Spent $15 on lunch today&quot;</span> to see
                it in action.
            </p>
        </div>
    );
}

function LoadingState({ title }: { title?: string }) {
    return (
        <div className='space-y-3'>
            {title && <h3 className='px-1 font-bold text-foreground text-sm sm:text-base'>{title}</h3>}
            <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 border-2 border-border rounded-2xl overflow-hidden'>
                <div className='divide-y divide-border'>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TransactionRowSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TransactionRowSkeleton() {
    return (
        <div className='flex justify-between items-center p-3 sm:p-4'>
            <div className='flex flex-1 items-center gap-3 sm:gap-4 min-w-0'>
                {/* Category Icon Skeleton */}
                <Skeleton className='rounded-xl w-12 sm:w-14 h-12 sm:h-14 shrink-0' />

                {/* Details Skeleton */}
                <div className='flex-1 space-y-2 min-w-0'>
                    <Skeleton className='w-32 sm:w-40 h-4' />
                    <div className='flex items-center gap-2'>
                        <Skeleton className='w-20 h-3' />
                        <Skeleton className='rounded-full size-1' />
                        <Skeleton className='w-16 h-3' />
                    </div>
                </div>
            </div>

            {/* Amount Skeleton */}
            <div className='text-right'>
                <Skeleton className='mb-1 w-20 sm:w-24 h-5' />
            </div>
        </div>
    );
}

export default TransactionList;
