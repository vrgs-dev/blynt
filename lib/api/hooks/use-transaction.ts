import { useMutation, useQuery } from '@tanstack/react-query';
import {
    CreateTransactionRequest,
    CreateTransactionResponse,
    createTransaction,
    getBudget,
    getOverview,
    updateTransaction,
    deleteTransaction,
    DateRangeParams,
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

export function useBudget(params?: DateRangeParams) {
    return useQuery({
        queryKey: ['budget', params?.startDate, params?.endDate],
        queryFn: () => getBudget(params),
    });
}

export function useOverview(params?: DateRangeParams) {
    return useQuery({
        queryKey: ['overview', params?.startDate, params?.endDate],
        queryFn: () => getOverview(params),
    });
}
