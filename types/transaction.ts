export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id?: string;
    type: TransactionType;
    amount: number;
    currency: string;
    category: string;
    date: string;
    description: string;
}

export interface TransactionFilters {
    startDate?: string;
    endDate?: string;
    category?: string;
    type?: TransactionType;
    search?: string;
    limit?: number;
    offset?: number;
}

export interface GetTransactionsResponse {
    transactions: Transaction[];
    total: number;
    limit: number;
    offset: number;
}
