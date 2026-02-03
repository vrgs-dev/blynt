import { api } from './axios';
import type { GetTransactionsResponse, Transaction, TransactionFilters } from '@/types/transaction';
import type { BudgetItem } from '@/app/(app)/_components/dashboard/types';

export interface CreateTransactionResponse {
    transactions: Transaction[];
}

export interface CreateTransactionRequest {
    transactions: Transaction[];
    rawInput: string;
}

export interface GetBudgetResponse {
    budgets: BudgetItem[];
}

export interface Stats {
    balance: { value: string; change: string; isPositive: boolean };
    income: { value: string; change: string; isPositive: boolean };
    expenses: { value: string; change: string; isPositive: boolean };
}

export interface GetOverviewResponse {
    stats: Stats;
    meta?: {
        historyDays: number;
        wasLimited: boolean;
        requestedDays: number | null;
        appliedStartDate: string;
    };
}

export async function createTransaction(data: CreateTransactionRequest) {
    const response = await api.post<CreateTransactionResponse>('/transactions', data);
    return response.data;
}

export async function getTransactions(filters: TransactionFilters) {
    const response = await api.get<GetTransactionsResponse>('/transactions', { params: filters });
    return response.data;
}

export interface DateRangeParams {
    startDate?: string;
    endDate?: string;
}

export async function getBudget(params?: DateRangeParams) {
    const response = await api.get<GetBudgetResponse>('/overview/budget', { params });
    return response.data;
}

export async function getOverview(params?: DateRangeParams) {
    const response = await api.get<GetOverviewResponse>('/overview', { params });
    return response.data;
}

export async function updateTransaction(id: string, data: Omit<Transaction, 'id'>) {
    const response = await api.put<{ transaction: Transaction }>(`/transactions/${id}`, data);
    return response.data;
}

export async function deleteTransaction(id: string) {
    const response = await api.delete<{ success: boolean }>(`/transactions/${id}`);
    return response.data;
}
