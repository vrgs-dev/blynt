'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Send,
    Loader2,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    X,
    ChevronRight,
    ChevronLeft,
    Save,
    Calendar,
    Tag,
    Store,
    ArrowUpCircle,
    ArrowDownCircle,
    Zap,
    Check,
    Trash2,
    DollarSign,
    Crown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParseTransaction, useSubscription } from '@/lib/api/hooks';
import type { NormalizedTransaction } from '@/lib/api';
import type { Category } from '@/types/category';
import { CATEGORIES, CATEGORY_COLORS } from '@/constants/category';
import { Transaction } from '@/types/transaction';
import { UpgradeDialog } from '@/components/upgrade-dialog';
import { useQueryClient } from '@tanstack/react-query';

interface TransactionInputProps {
    onAdd: (transaction: Transaction, rawInput: string) => void;
}

/**
 * Convert API response to component's ParseResult format
 */
function toParseResult(tx: NormalizedTransaction): Transaction {
    return {
        amount: tx.amount,
        category: (CATEGORIES.includes(tx.category as Category) ? tx.category : 'Other') as Category,
        description: tx.description || '',
        date: tx.date,
        type: tx.type,
        currency: tx.currency,
    };
}

export function InputParse({ onAdd }: TransactionInputProps) {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successCount, setSuccessCount] = useState(0);
    const [lastTagApplied, setLastTagApplied] = useState<string | null>(null);
    const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [upgradeDetails, setUpgradeDetails] = useState<{ currentUsage: number; limit: number } | undefined>();
    const inputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();
    const { data: subscriptionData } = useSubscription();
    const isFreePlan = subscriptionData?.plan.tier === 'free';
    const usage = subscriptionData?.usage;

    const parseMutation = useParseTransaction({
        onSuccess: async (transactions) => {
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
            await queryClient.invalidateQueries({ queryKey: ['budget'] });
            await queryClient.invalidateQueries({ queryKey: ['overview'] });

            await queryClient.refetchQueries({ queryKey: ['transactions'] });
            await queryClient.refetchQueries({ queryKey: ['subscription'] });

            if (transactions.length > 0) {
                setPendingTransactions(transactions.map(toParseResult));
                setCurrentIndex(0);
                setError(null);
            } else {
                setError("Couldn't understand the details. Try: 'Spent $20 at Pizza Hut'");
            }
        },
        onError: (err: Error & { response?: { data?: { code?: string; usage?: { limit?: number } } } }) => {
            // Check if it's a limit reached error
            if (err.response?.data?.code === 'LIMIT_REACHED') {
                setUpgradeDetails({
                    currentUsage: usage?.transactionsUsed ?? 0,
                    limit: err.response.data.usage?.limit ?? usage?.transactionsLimit ?? 50,
                });
                setShowUpgradeDialog(true);
                setError(null);
            } else {
                setError(err.message || 'Something went wrong. Please try again.');
            }
        },
    });

    const isParsing = parseMutation.isPending;
    const currentTransaction = pendingTransactions[currentIndex];
    const hasMultiple = pendingTransactions.length > 1;

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const handleParse = (e?: React.SubmitEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isParsing) return;

        setError(null);
        setShowSuccess(false);
        parseMutation.mutate({ input: input.trim() });
    };

    const handleConfirmCurrent = () => {
        if (!currentTransaction) return;

        onAdd(currentTransaction, input);

        // Remove current and move to next
        const remaining = pendingTransactions.filter((_, i) => i !== currentIndex);
        if (remaining.length === 0) {
            setPendingTransactions([]);
            setInput('');
            setSuccessCount(1);
            setShowSuccess(true);
        } else {
            setPendingTransactions(remaining);
            setCurrentIndex(Math.min(currentIndex, remaining.length - 1));
        }
    };

    const handleConfirmAll = () => {
        pendingTransactions.forEach((tx) => {
            onAdd(tx, input);
        });

        setSuccessCount(pendingTransactions.length);
        setPendingTransactions([]);
        setInput('');
        setShowSuccess(true);
    };

    const handleRemoveCurrent = () => {
        const remaining = pendingTransactions.filter((_, i) => i !== currentIndex);
        if (remaining.length === 0) {
            setPendingTransactions([]);
        } else {
            setPendingTransactions(remaining);
            setCurrentIndex(Math.min(currentIndex, remaining.length - 1));
        }
    };

    const handleCancel = () => {
        setPendingTransactions([]);
        setCurrentIndex(0);
    };

    const handleQuickTag = (text: string) => {
        setInput(text);
        setLastTagApplied(text);
        inputRef.current?.focus();
        setTimeout(() => setLastTagApplied(null), 600);
    };

    const updateCurrent = (updates: Partial<Transaction>) => {
        if (!currentTransaction) return;
        setPendingTransactions((prev) => prev.map((tx, i) => (i === currentIndex ? { ...tx, ...updates } : tx)));
    };

    // Confirmation view
    if (currentTransaction) {
        return (
            <>
                <UpgradeDialog
                    open={showUpgradeDialog}
                    onOpenChange={setShowUpgradeDialog}
                    reason='transaction_limit'
                    details={upgradeDetails}
                />
                <div className='slide-in-from-bottom-2 relative bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)] p-5 sm:p-6 border-2 border-foreground/10 rounded-2xl overflow-hidden transition-all animate-in duration-300 fade-in'>
                    {/* Decorative corner */}
                    <div className='-top-8 -right-8 absolute bg-primary/5 rounded-full size-24' />
                    <div className='-bottom-6 -left-6 absolute bg-accent/5 rounded-full size-16' />

                    {/* Header */}
                    <div className='relative flex justify-between items-center mb-5 sm:mb-6'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <div className='flex justify-center items-center bg-primary/10 border-2 border-primary/20 rounded-xl size-10 sm:size-11'>
                                    <Sparkles className='size-5 text-primary' />
                                </div>
                                <div className='-right-0.5 -bottom-0.5 absolute bg-primary border-2 border-card rounded-full size-3 animate-pulse' />
                            </div>
                            <div>
                                <h3 className='font-bold text-foreground text-sm sm:text-base'>
                                    {hasMultiple ? 'Review Transactions' : 'Confirm Transaction'}
                                </h3>
                                <p className='font-semibold text-[10px] text-muted-foreground sm:text-xs uppercase tracking-widest'>
                                    {hasMultiple
                                        ? `${currentIndex + 1} of ${pendingTransactions.length} detected`
                                        : 'Review the details'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCancel}
                            className='flex justify-center items-center hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-xl size-9 text-muted-foreground hover:text-destructive transition-all'
                        >
                            <X className='size-5' />
                        </button>
                    </div>

                    {/* Navigation for multiple transactions */}
                    {hasMultiple && (
                        <div className='relative flex justify-between items-center mb-4 px-1'>
                            <button
                                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                                disabled={currentIndex === 0}
                                className='flex items-center gap-1 disabled:opacity-30 font-semibold text-muted-foreground hover:text-foreground text-xs transition-colors disabled:cursor-not-allowed'
                            >
                                <ChevronLeft className='size-4' />
                                Prev
                            </button>
                            <div className='flex gap-1'>
                                {pendingTransactions.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={cn(
                                            'rounded-full size-2 transition-all',
                                            i === currentIndex
                                                ? 'bg-primary scale-125'
                                                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
                                        )}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentIndex((i) => Math.min(pendingTransactions.length - 1, i + 1))}
                                disabled={currentIndex === pendingTransactions.length - 1}
                                className='flex items-center gap-1 disabled:opacity-30 font-semibold text-muted-foreground hover:text-foreground text-xs transition-colors disabled:cursor-not-allowed'
                            >
                                Next
                                <ChevronRight className='size-4' />
                            </button>
                        </div>
                    )}

                    <div className='relative space-y-4'>
                        {/* Amount & Type */}
                        <div className='flex items-center gap-3 sm:gap-4 bg-muted/30 p-3 sm:p-4 border-2 border-border rounded-xl'>
                            <button
                                onClick={() =>
                                    updateCurrent({ type: currentTransaction.type === 'income' ? 'expense' : 'income' })
                                }
                                className={cn(
                                    'flex justify-center items-center border-2 rounded-xl size-12 sm:size-14 active:scale-95 transition-all duration-200 shrink-0',
                                    currentTransaction.type === 'income'
                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                        : 'border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100',
                                )}
                            >
                                {currentTransaction.type === 'income' ? (
                                    <ArrowUpCircle className='size-6 sm:size-7' />
                                ) : (
                                    <ArrowDownCircle className='size-6 sm:size-7' />
                                )}
                            </button>
                            <div className='flex-1 min-w-0'>
                                <label className='block mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                    Amount
                                </label>
                                <div className='flex items-baseline gap-1'>
                                    <span className='font-bold text-muted-foreground text-lg sm:text-xl'>$</span>
                                    <input
                                        type='number'
                                        value={currentTransaction.amount}
                                        onChange={(e) => updateCurrent({ amount: parseFloat(e.target.value) || 0 })}
                                        className='bg-transparent outline-none w-full font-black text-foreground text-2xl sm:text-3xl tracking-tight'
                                        step='0.01'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Merchant & Date */}
                        <div className='gap-3 sm:gap-4 grid grid-cols-1 sm:grid-cols-2'>
                            <div className='space-y-1.5'>
                                <label className='flex items-center gap-1.5 ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                    <DollarSign className='size-3' /> Currency
                                </label>
                                <select
                                    value={currentTransaction.currency}
                                    onChange={(e) => updateCurrent({ currency: e.target.value })}
                                    className='bg-card px-3 sm:px-4 py-2.5 border-2 border-border focus:border-primary/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full font-semibold text-foreground text-sm transition-all appearance-none'
                                >
                                    <option value='USD'>USD</option>
                                    <option value='EUR'>EUR</option>
                                    <option value='GBP'>GBP</option>
                                    <option value='JPY'>JPY</option>
                                    <option value='CAD'>CAD</option>
                                    <option value='AUD'>AUD</option>
                                    <option value='CHF'>CHF</option>
                                    <option value='CNY'>CNY</option>
                                    <option value='INR'>INR</option>
                                </select>
                            </div>

                            <div className='space-y-1.5'>
                                <label className='flex items-center gap-1.5 ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                    <Calendar className='size-3' /> Date
                                </label>
                                <input
                                    type='date'
                                    value={currentTransaction.date}
                                    onChange={(e) => updateCurrent({ date: e.target.value })}
                                    className='bg-card px-3 sm:px-4 py-2.5 border-2 border-border focus:border-primary/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full font-semibold text-foreground text-sm transition-all'
                                />
                            </div>

                            <div className='space-y-1.5'>
                                <label className='flex items-center gap-1.5 ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                    <Store className='size-3' /> Description
                                </label>
                                <input
                                    type='text'
                                    value={currentTransaction.description}
                                    onChange={(e) => updateCurrent({ description: e.target.value })}
                                    className='bg-card px-3 sm:px-4 py-2.5 border-2 border-border focus:border-primary/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-full font-semibold text-foreground text-sm transition-all'
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className='space-y-2'>
                            <label className='flex items-center gap-1.5 ml-1 font-bold text-[10px] text-muted-foreground uppercase tracking-wider'>
                                <Tag className='size-3' /> Category
                            </label>
                            <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                                {CATEGORIES.map((cat) => {
                                    const colors = CATEGORY_COLORS[cat];
                                    const isSelected = currentTransaction.category === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => updateCurrent({ category: cat })}
                                            className={cn(
                                                'px-2.5 sm:px-3 py-1.5 border-2 rounded-lg font-bold text-[10px] sm:text-xs uppercase tracking-wide active:scale-95 transition-all duration-200',
                                                isSelected
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                                    : cn(colors.bg, colors.text, 'hover:border-primary/30'),
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='flex gap-2 sm:gap-3 mt-6'>
                        {hasMultiple ? (
                            <>
                                <button
                                    onClick={handleRemoveCurrent}
                                    className='flex justify-center items-center bg-muted/50 hover:bg-destructive/10 px-3 py-3 border-2 border-border hover:border-destructive/30 rounded-xl font-bold text-muted-foreground hover:text-destructive text-sm active:scale-[0.98] transition-all'
                                    title='Remove this transaction'
                                >
                                    <Trash2 className='size-4' />
                                </button>
                                <button
                                    onClick={handleConfirmCurrent}
                                    className='flex flex-1 justify-center items-center gap-2 bg-muted/50 hover:bg-muted px-4 py-3 border-2 border-border rounded-xl font-bold text-foreground text-sm active:scale-[0.98] transition-all'
                                >
                                    <Check className='size-4' />
                                    Save This
                                </button>
                                <button
                                    onClick={handleConfirmAll}
                                    className='group flex flex-1 justify-center items-center gap-2 bg-primary shadow-[3px_3px_0px_0px] shadow-primary/30 hover:shadow-[1px_1px_0px_0px] hover:shadow-primary/30 active:shadow-none px-4 py-3 border-2 border-primary rounded-xl font-bold text-primary-foreground text-sm active:scale-[0.98] transition-all'
                                >
                                    <Save className='size-4' />
                                    Save All ({pendingTransactions.length})
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className='flex-1 bg-muted/50 hover:bg-muted px-4 py-3 border-2 border-border rounded-xl font-bold text-muted-foreground text-sm active:scale-[0.98] transition-all'
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleConfirmCurrent}
                                    className='group flex flex-2 justify-center items-center gap-2 bg-primary shadow-[3px_3px_0px_0px] shadow-primary/30 hover:shadow-[1px_1px_0px_0px] hover:shadow-primary/30 active:shadow-none px-4 py-3 border-2 border-primary rounded-xl font-bold text-primary-foreground text-sm active:scale-[0.98] transition-all'
                                >
                                    <Save className='size-4' />
                                    Save
                                    <ChevronRight className='size-4 transition-transform group-hover:translate-x-0.5' />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // Main input view
    return (
        <>
            <UpgradeDialog
                open={showUpgradeDialog}
                onOpenChange={setShowUpgradeDialog}
                reason='transaction_limit'
                details={upgradeDetails}
            />
            <div
                className={cn(
                    'relative bg-card p-4 sm:p-5 border-2 rounded-2xl overflow-hidden transition-all duration-300',
                    isFocused
                        ? 'border-primary/40 shadow-[4px_4px_0px_0px] shadow-primary/20'
                        : 'border-border shadow-[3px_3px_0px_0px] shadow-foreground/5 hover:shadow-[4px_4px_0px_0px] hover:shadow-foreground/8',
                )}
            >
                {/* Decorative elements */}
                <div
                    className={cn(
                        '-top-12 -right-12 absolute rounded-full size-32 transition-all duration-500',
                        isFocused ? 'bg-primary/8 scale-110' : 'bg-primary/3',
                    )}
                />

                {/* Header */}
                <div className='relative flex items-center gap-2 mb-3 sm:mb-4'>
                    <div
                        className={cn(
                            'flex justify-center items-center border-2 rounded-lg size-8 sm:size-9 transition-all duration-300',
                            isParsing
                                ? 'animate-pulse border-primary/40 bg-primary/20'
                                : 'border-primary/20 bg-primary/10',
                        )}
                    >
                        {isParsing ? (
                            <Zap className='size-4 sm:size-5 text-primary animate-pulse' />
                        ) : (
                            <Sparkles className='size-4 sm:size-5 text-primary' />
                        )}
                    </div>
                    <div className='flex-1'>
                        <h3 className='font-bold text-foreground text-sm sm:text-base'>Natural Input</h3>
                        <p className='font-semibold text-[9px] text-muted-foreground sm:text-[10px] uppercase tracking-widest'>
                            Type as you speak
                        </p>
                    </div>
                    {/* Usage indicator for free plan */}
                    {isFreePlan && usage && (
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 border border-border rounded-lg'>
                                <Crown className='size-3 text-amber-500' />
                                <span className='font-bold text-[10px] text-muted-foreground'>
                                    {usage.transactionsUsed}/{usage.transactionsLimit}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input form */}
                <form onSubmit={handleParse} className='relative'>
                    <div
                        className={cn(
                            'relative border-2 rounded-xl transition-all duration-300',
                            error
                                ? 'border-destructive/50 bg-destructive/5'
                                : showSuccess
                                  ? 'border-emerald-400/50 bg-emerald-50/50'
                                  : isFocused
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-border bg-muted/30',
                        )}
                    >
                        <input
                            ref={inputRef}
                            type='text'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder='Spent $45 at grocery and $20 on gas'
                            className={cn(
                                'bg-transparent py-3.5 sm:py-4 pr-14 sm:pr-16 pl-4 sm:pl-5 outline-none w-full font-medium text-foreground placeholder:text-muted-foreground/60 text-sm sm:text-base',
                                isParsing && 'cursor-wait opacity-70',
                            )}
                            disabled={isParsing}
                        />

                        <button
                            type='submit'
                            disabled={isParsing || !input.trim()}
                            className={cn(
                                'top-1/2 right-2 sm:right-2.5 absolute flex justify-center items-center border-2 rounded-lg size-10 sm:size-11 text-white active:scale-90 transition-all -translate-y-1/2 duration-300',
                                showSuccess
                                    ? 'border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-200'
                                    : isParsing
                                      ? 'border-primary/50 bg-primary/70'
                                      : input.trim()
                                        ? 'border-primary bg-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30'
                                        : 'border-muted bg-muted text-muted-foreground',
                            )}
                        >
                            {isParsing ? (
                                <Loader2 className='size-5 animate-spin' />
                            ) : showSuccess ? (
                                <CheckCircle2 className='size-5 animate-in duration-200 zoom-in-50' />
                            ) : (
                                <Send className='size-5' />
                            )}
                        </button>
                    </div>
                </form>

                {/* Status messages */}
                <div className='mt-2 h-5 sm:h-6 overflow-hidden'>
                    {error && (
                        <div className='flex items-center gap-2 slide-in-from-top-1 animate-in duration-200'>
                            <AlertCircle className='size-3.5 sm:size-4 text-destructive shrink-0' />
                            <span className='font-semibold text-destructive text-xs sm:text-sm truncate'>{error}</span>
                        </div>
                    )}
                    {showSuccess && !error && (
                        <div className='flex items-center gap-2 slide-in-from-top-1 text-emerald-600 animate-in duration-200'>
                            <div className='bg-emerald-500 rounded-full size-1.5 animate-ping' />
                            <span className='font-bold text-xs sm:text-sm'>
                                {successCount > 1 ? `${successCount} transactions added` : 'Transaction added'}
                            </span>
                        </div>
                    )}
                    {isParsing && !error && (
                        <div className='flex items-center gap-2 animate-in duration-200 fade-in'>
                            <span className='flex gap-0.5'>
                                <span className='bg-primary rounded-full size-1 animate-bounce [animation-delay:-0.3s]' />
                                <span className='bg-primary rounded-full size-1 animate-bounce [animation-delay:-0.15s]' />
                                <span className='bg-primary rounded-full size-1 animate-bounce' />
                            </span>
                            <span className='font-bold text-[10px] text-primary sm:text-xs uppercase tracking-widest'>
                                Analyzing...
                            </span>
                        </div>
                    )}
                </div>

                {/* Quick suggestions */}
                <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4'>
                    <span className='mr-1 font-bold text-[9px] text-muted-foreground sm:text-[10px] uppercase tracking-widest'>
                        Try:
                    </span>
                    <QuickTag
                        text='Paid $1200 for rent'
                        active={lastTagApplied === 'Paid $1200 for rent'}
                        onClick={handleQuickTag}
                    />
                    <QuickTag
                        text='Spent $15 on coffee'
                        active={lastTagApplied === 'Spent $15 on coffee'}
                        onClick={handleQuickTag}
                    />
                    <QuickTag
                        text='Received $3000 salary'
                        active={lastTagApplied === 'Received $3000 salary'}
                        onClick={handleQuickTag}
                    />
                </div>
            </div>
        </>
    );
}

function QuickTag({ text, active, onClick }: { text: string; active: boolean; onClick: (s: string) => void }) {
    return (
        <button
            onClick={() => onClick(text)}
            className={cn(
                'px-2.5 sm:px-3 py-1 sm:py-1.5 border rounded-full font-bold text-[10px] sm:text-xs active:scale-95 transition-all duration-200',
                active
                    ? 'scale-105 border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
            )}
        >
            {text}
        </button>
    );
}

export default InputParse;
