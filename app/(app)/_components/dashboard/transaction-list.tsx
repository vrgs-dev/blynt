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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction, Category } from './types';
import { formatDate } from '@/lib/date';

interface ExpenseListProps {
    transactions: Transaction[];
    onDelete?: (id: string) => void;
    title?: string;
    showEmpty?: boolean;
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

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; border: string }> = {
    Food: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    Transport: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    Utilities: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    Entertainment: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    Healthcare: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    Shopping: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    Salary: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    Other: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
};

export function TransactionList({ transactions, onDelete, title, showEmpty = true }: ExpenseListProps) {
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
    onDelete?: (id: string) => void;
    isFirst?: boolean;
    isLast?: boolean;
}

function TransactionRow({ transaction, onDelete }: TransactionRowProps) {
    const styles = CATEGORY_STYLES[transaction.category] || CATEGORY_STYLES.Other;
    const icon = CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.Other;

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
                    <h4 className='font-bold text-foreground text-sm sm:text-base truncate'>{transaction.merchant}</h4>
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
            <div className='flex items-center gap-2 sm:gap-4 shrink-0'>
                <div className='text-right'>
                    <p
                        className={cn(
                            'font-black text-base sm:text-lg tracking-tight',
                            transaction.type ? 'text-emerald-600' : 'text-foreground',
                        )}
                    >
                        {transaction.type ? '+' : '-'}$
                        {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    {transaction.note && (
                        <p className='max-w-[100px] sm:max-w-[120px] text-[10px] text-muted-foreground truncate'>
                            {transaction.note}
                        </p>
                    )}
                </div>

                {onDelete && (
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className='hover:bg-destructive/10 opacity-0 focus:opacity-100 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground/50 hover:text-destructive transition-all'
                        aria-label='Delete transaction'
                    >
                        <Trash2 className='size-4' />
                    </button>
                )}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className='flex flex-col items-center bg-card p-8 sm:p-12 border-2 border-border border-dashed rounded-2xl text-center animate-in duration-500 fade-in'>
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
                Turn your natural thoughts into clear data. Try saying{' '}
                <span className='font-semibold text-primary italic'>&quot;Spent $15 on lunch today&quot;</span> to see
                it in action.
            </p>

            <div className='flex items-center gap-2 bg-muted/50 px-4 py-2 border border-border rounded-full font-bold text-[10px] text-muted-foreground uppercase tracking-widest'>
                <div className='bg-primary rounded-full size-1.5 animate-ping' />
                Awaiting your first transaction
            </div>
        </div>
    );
}

export default TransactionList;
