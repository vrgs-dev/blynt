'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions } from '@/lib/api/transaction';
import { useUpdateTransaction, useDeleteTransaction } from '@/lib/api/hooks/use-transaction';
import TransactionList from './transaction-list';
import { TransactionFilters } from './transaction-filters';
import { TransactionEditModal } from './transaction-edit-modal';
import { TransactionDeleteModal } from './transaction-delete-modal';
import type { TransactionFilters as Filters, Transaction } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { subDays } from 'date-fns';

const ITEMS_PER_PAGE = 10;

export function TransactionsTab() {
    const now = new Date().toISOString().split('T')[0];
    const startDate = subDays(now, 7).toISOString().split('T')[0];

    const queryClient = useQueryClient();
    const [filters, setFilters] = useState<Filters>({
        limit: ITEMS_PER_PAGE,
        offset: 0,
        startDate,
        endDate: now,
    });

    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => getTransactions(filters),
    });

    const { mutate: updateTransaction } = useUpdateTransaction({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
            await queryClient.invalidateQueries({ queryKey: ['budget'] });
            await queryClient.invalidateQueries({ queryKey: ['overview'] });
            await queryClient.refetchQueries({ queryKey: ['transactions'] });
            await queryClient.refetchQueries({ queryKey: ['subscription'] });
        },
        onError: (error) => {
            console.error('Error updating transaction:', error);
        },
    });

    const { mutate: deleteTransaction } = useDeleteTransaction({
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['transactions'] });
            await queryClient.invalidateQueries({ queryKey: ['budget'] });
            await queryClient.invalidateQueries({ queryKey: ['overview'] });
            await queryClient.refetchQueries({ queryKey: ['transactions'] });
            await queryClient.refetchQueries({ queryKey: ['subscription'] });
        },
        onError: (error) => {
            console.error('Error deleting transaction:', error);
        },
    });

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleDeleteTransaction = (id: string) => {
        setDeletingTransactionId(id);
        setIsDeleteModalOpen(true);
    };

    const handleSaveTransaction = (transaction: Transaction) => {
        if (transaction.id) {
            const { id, ...data } = transaction;
            updateTransaction({ id, data });
        }
    };

    const handleConfirmDelete = () => {
        if (deletingTransactionId) {
            deleteTransaction(deletingTransactionId);
            setDeletingTransactionId(null);
        }
    };

    const handleFilterChange = (newFilters: Partial<Filters>) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            offset: 0, // Reset to first page when filters change
        }));
    };

    const handlePageChange = (direction: 'prev' | 'next') => {
        setFilters((prev) => ({
            ...prev,
            offset: direction === 'next' ? prev.offset! + ITEMS_PER_PAGE : Math.max(0, prev.offset! - ITEMS_PER_PAGE),
        }));
    };

    const currentPage = Math.floor((filters.offset || 0) / ITEMS_PER_PAGE) + 1;
    const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;
    const hasNextPage = data ? (filters.offset || 0) + ITEMS_PER_PAGE < data.total : false;
    const hasPrevPage = (filters.offset || 0) > 0;

    const deletingTransaction = data?.transactions.find((t) => t.id === deletingTransactionId);

    return (
        <>
            <div className='space-y-4 sm:space-y-6'>
                {/* Filters */}
                <TransactionFilters filters={filters} onFilterChange={handleFilterChange} />

                {/* Transaction List */}
                <TransactionList
                    transactions={data?.transactions ?? []}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                    title='All Transactions'
                    showEmpty={true}
                    isLoading={isLoading}
                />

                {/* Pagination */}
                {data && data.total > ITEMS_PER_PAGE && (
                    <div className='flex justify-between items-center gap-4 bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 border-2 border-border rounded-2xl'>
                        <div className='flex items-center gap-2'>
                            <p className='font-medium text-muted-foreground text-sm'>
                                Showing <span className='font-bold text-foreground'>{(filters.offset || 0) + 1}</span>{' '}
                                to{' '}
                                <span className='font-bold text-foreground'>
                                    {Math.min((filters.offset || 0) + ITEMS_PER_PAGE, data.total)}
                                </span>{' '}
                                of <span className='font-bold text-foreground'>{data.total}</span> transactions
                            </p>
                        </div>

                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handlePageChange('prev')}
                                disabled={!hasPrevPage}
                                className='shadow-[2px_2px_0px_0px] shadow-foreground/5 border-2'
                            >
                                <ChevronLeft className='size-4' />
                                <span className='hidden sm:inline'>Previous</span>
                            </Button>

                            <div className='flex items-center gap-1 bg-muted/50 px-3 py-1.5 border-2 border-border/50 rounded-lg'>
                                <span className='font-bold text-foreground text-xs'>{currentPage}</span>
                                <span className='text-muted-foreground text-xs'>/</span>
                                <span className='font-bold text-foreground text-xs'>{totalPages}</span>
                            </div>

                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handlePageChange('next')}
                                disabled={!hasNextPage}
                                className='shadow-[2px_2px_0px_0px] shadow-foreground/5 border-2'
                            >
                                <span className='hidden sm:inline'>Next</span>
                                <ChevronRight className='size-4' />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <TransactionEditModal
                transaction={editingTransaction}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTransaction(null);
                }}
                onSave={handleSaveTransaction}
            />

            {/* Delete Confirmation Modal */}
            <TransactionDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingTransactionId(null);
                }}
                onConfirm={handleConfirmDelete}
                transactionDescription={deletingTransaction?.description}
            />
        </>
    );
}
