import { useMutation, useQuery } from '@tanstack/react-query';
import {
    CreateTransactionRequest,
    CreateTransactionResponse,
    createTransaction,
    getBudget,
    getOverview,
    updateTransaction,
    deleteTransaction,
} from '../transaction';
import type { Transaction } from '@/types/transaction';

interface UseTransactionOptions {
    onSuccess?: (data: CreateTransactionResponse) => void;
    onError?: (error: Error) => void;
}

interface UseUpdateTransactionOptions {
    onSuccess?: (data: { transaction: Transaction }) => void;
    onError?: (error: Error) => void;
}

interface UseDeleteTransactionOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useCreateTransaction(options?: UseTransactionOptions) {
    return useMutation({
        mutationFn: (data: CreateTransactionRequest) => createTransaction(data),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}

export function useUpdateTransaction(options?: UseUpdateTransactionOptions) {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Omit<Transaction, 'id'> }) => updateTransaction(id, data),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}

export function useDeleteTransaction(options?: UseDeleteTransactionOptions) {
    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}

export function useBudget() {
    return useQuery({
        queryKey: ['budget'],
        queryFn: () => getBudget(),
    });
}

export function useOverview() {
    return useQuery({
        queryKey: ['overview'],
        queryFn: () => getOverview(),
    });
}
