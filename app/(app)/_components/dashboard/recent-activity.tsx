'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction } from './types';
import { formatRelativeDate } from '@/lib/date';

interface RecentActivityProps {
    transactions: Transaction[];
    title?: string;
    limit?: number;
}

export function RecentActivity({ transactions, title = 'Recent Activity', limit = 5 }: RecentActivityProps) {
    const recentTransactions = transactions.slice(0, limit);

    if (recentTransactions.length === 0) {
        return (
            <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 sm:p-5 border-2 border-border rounded-2xl'>
                <h3 className='mb-4 font-bold text-foreground text-sm sm:text-base'>{title}</h3>
                <p className='py-6 text-muted-foreground text-sm text-center'>No recent activity</p>
            </div>
        );
    }

    return (
        <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 sm:p-5 border-2 border-border rounded-2xl'>
            <h3 className='mb-4 sm:mb-5 font-bold text-foreground text-sm sm:text-base'>{title}</h3>

            <div className='space-y-3 sm:space-y-4'>
                {recentTransactions.map((transaction) => (
                    <ActivityRow key={transaction.id} transaction={transaction} />
                ))}
            </div>
        </div>
    );
}

interface ActivityRowProps {
    transaction: Transaction;
}

function ActivityRow({ transaction }: ActivityRowProps) {
    return (
        <div className='group flex justify-between items-center gap-3'>
            <div className='flex flex-1 items-center gap-3 min-w-0'>
                {/* Direction indicator */}
                <div
                    className={cn(
                        'p-1.5 rounded-lg group-hover:scale-110 transition-transform shrink-0',
                        transaction.type ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600',
                    )}
                >
                    {transaction.type ? <ArrowUpRight className='size-3.5' /> : <ArrowDownRight className='size-3.5' />}
                </div>

                {/* Details */}
                <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-foreground text-xs sm:text-sm truncate'>{transaction.merchant}</p>
                    <p className='text-[10px] text-muted-foreground sm:text-xs'>
                        {formatRelativeDate(transaction.date)}
                    </p>
                </div>
            </div>

            {/* Amount */}
            <p
                className={cn(
                    'font-bold text-xs sm:text-sm whitespace-nowrap',
                    transaction.type ? 'text-emerald-600' : 'text-foreground',
                )}
            >
                {transaction.type ? '+' : '-'}$
                {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
}

export default RecentActivity;
