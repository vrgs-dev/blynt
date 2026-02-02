'use client';

import { useState } from 'react';
import type { TransactionFilters as Filters } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Calendar, Crown } from 'lucide-react';
import { CATEGORIES } from '@/constants/category';
import { Input } from '@/components/ui/input';
import { useSubscription } from '@/lib/api/hooks';
import { validateDateRange } from '@/lib/billing/validate-date-range';
import { UpgradeDialog } from '@/components/upgrade-dialog';
import { cn } from '@/lib/utils';

interface TransactionFiltersProps {
    filters: Filters;
    onFilterChange: (filters: Partial<Filters>) => void;
}

export function TransactionFilters({ filters, onFilterChange }: TransactionFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
    const [upgradeDetails, setUpgradeDetails] = useState<{ requestedDays: number; maxDays: number } | undefined>();

    const { data: subscriptionData } = useSubscription();
    const planTier = subscriptionData?.plan.tier ?? 'free';
    const maxHistoryDays = subscriptionData?.plan.features.historyDays ?? 7;

    const handleSearchSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onFilterChange({ search: searchInput || undefined });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        onFilterChange({
            search: undefined,
            category: undefined,
            type: undefined,
            startDate: new Date().toISOString().split('T')[0],
            endDate: undefined,
        });
        setShowFilters(false);
    };

    const hasActiveFilters = filters.search || filters.category || filters.type || filters.startDate || filters.endDate;
    const isFreePlan = planTier === 'free';

    const handleDateChange = (field: 'startDate' | 'endDate', value: string | undefined) => {
        const startDate = field === 'startDate' ? value : filters.startDate;
        const endDate = field === 'endDate' ? value : filters.endDate;

        // Validate date range for free plan
        // Use today as default endDate if not specified
        if (startDate) {
            const effectiveEndDate = endDate || new Date().toISOString().split('T')[0];
            const validation = validateDateRange(planTier, startDate, effectiveEndDate);

            if (validation.requiresUpgrade) {
                setUpgradeDetails({
                    requestedDays: validation.requestedDays,
                    maxDays: validation.maxDays,
                });
                setShowUpgradeDialog(true);
                return; // Don't apply the filter
            }
        }

        onFilterChange({ [field]: value || undefined });
    };

    return (
        <>
            <UpgradeDialog
                open={showUpgradeDialog}
                onOpenChange={setShowUpgradeDialog}
                reason='date_range'
                details={upgradeDetails}
            />
            <div className='space-y-3'>
                {/* Search and Filter Toggle */}
                <div className='flex sm:flex-row flex-col gap-3'>
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className='flex-1'>
                        <div className='relative'>
                            <Search className='top-1/2 left-4 z-10 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none' />
                            <Input
                                type='text'
                                placeholder='Search transactions...'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className='bg-card pl-11'
                            />
                        </div>
                    </form>

                    {/* Filter Toggle Button */}
                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => setShowFilters(!showFilters)}
                            className='relative shadow-[2px_2px_0px_0px] shadow-foreground/5 py-5 border-'
                        >
                            <Filter className='size-4' />
                            <span className='hidden sm:inline'>Filters</span>
                            {hasActiveFilters && (
                                <div className='-top-1 -right-1 absolute bg-primary border-2 border-card rounded-full size-2.5' />
                            )}
                        </Button>

                        {hasActiveFilters && (
                            <Button
                                variant='ghost'
                                size='icon-sm'
                                onClick={handleClearFilters}
                                className='hover:bg-destructive/10 hover:text-destructive'
                            >
                                <X className='size-4' />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className='bg-card slide-in-from-top-2 shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 sm:p-6 border-2 border-border rounded-2xl animate-in duration-200'>
                        <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
                            {/* Type Filter */}
                            <div className='space-y-2'>
                                <label className='font-bold text-foreground text-xs uppercase tracking-wide'>
                                    Type
                                </label>
                                <select
                                    value={filters.type || ''}
                                    onChange={(e) =>
                                        onFilterChange({
                                            type: e.target.value ? (e.target.value as 'income' | 'expense') : undefined,
                                        })
                                    }
                                    className='bg-muted/50 px-3 py-2 border-2 border-border/50 focus:border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full font-semibold text-foreground text-sm transition-all'
                                >
                                    <option value=''>All Types</option>
                                    <option value='expense'>Expenses</option>
                                    <option value='income'>Income</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className='space-y-2'>
                                <label className='font-bold text-foreground text-xs uppercase tracking-wide'>
                                    Category
                                </label>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => onFilterChange({ category: e.target.value || undefined })}
                                    className='bg-muted/50 px-3 py-2 border-2 border-border/50 focus:border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full font-semibold text-foreground text-sm transition-all'
                                >
                                    <option value=''>All Categories</option>
                                    {CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Date */}
                            <div className='space-y-2'>
                                <label className='font-bold text-foreground text-xs uppercase tracking-wide'>
                                    From Date
                                </label>
                                <div className='relative'>
                                    <Calendar className='top-1/2 left-4 z-10 absolute size-3.5 text-muted-foreground -translate-y-1/2 pointer-events-none' />
                                    <Input
                                        type='date'
                                        value={filters.startDate || ''}
                                        onChange={(e) => handleDateChange('startDate', e.target.value || undefined)}
                                        className='pl-10'
                                    />
                                </div>
                                {isFreePlan && (
                                    <p className='flex items-center gap-1 text-[10px] text-muted-foreground'>
                                        <Crown className='size-3 text-amber-500' />
                                        Max {maxHistoryDays} days on free plan
                                    </p>
                                )}
                            </div>

                            {/* End Date */}
                            <div className='space-y-2'>
                                <label className='font-bold text-foreground text-xs uppercase tracking-wide'>
                                    To Date
                                </label>
                                <div className='relative'>
                                    <Calendar className='top-1/2 left-4 z-10 absolute size-3.5 text-muted-foreground -translate-y-1/2 pointer-events-none' />
                                    <Input
                                        type='date'
                                        value={filters.endDate || ''}
                                        onChange={(e) => handleDateChange('endDate', e.target.value || undefined)}
                                        className='pl-10'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
