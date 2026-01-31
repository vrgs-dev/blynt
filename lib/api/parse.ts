import { api } from './axios';
import type { Transaction, ParsedResponse, TransactionType } from '@/services/types';

// Request types
export interface ParseTransactionRequest {
    input: string;
    currency?: string;
}

// Response types
export interface ParseTransactionResponse {
    response: ParsedResponse;
}

// Normalized transaction for UI consumption
export interface NormalizedTransaction {
    amount: number;
    currency: string;
    category: string;
    merchant: string;
    date: string;
    type: TransactionType;
    note?: string;
}

/**
 * Parse natural language input into transaction data
 */
export async function parseTransaction(data: ParseTransactionRequest): Promise<NormalizedTransaction[]> {
    const response = await api.post<ParseTransactionResponse>('/parse', {
        input: data.input,
        currency: data.currency || 'USD',
    });

    return normalizeTransactions(response.data.response);
}

/**
 * Normalize API response to UI-friendly format
 */
function normalizeTransactions(response: ParsedResponse): NormalizedTransaction[] {
    const transactions = 'transaction' in response ? [response.transaction] : response.transactions;

    return transactions.map(normalizeTransaction);
}

function normalizeTransaction(tx: Transaction): NormalizedTransaction {
    return {
        amount: tx.amount,
        category: normalizeCategory(tx.category),
        merchant: tx.description,
        date: tx.date,
        type: tx.type,
        currency: tx.currency,
        note: tx.description,
    };
}

/**
 * Map API categories to UI categories
 */
function normalizeCategory(apiCategory: string): string {
    const categoryMap: Record<string, string> = {
        // Food
        food: 'Food',
        dining: 'Food',
        restaurant: 'Food',
        groceries: 'Food',
        grocery: 'Food',
        coffee: 'Food',
        lunch: 'Food',
        dinner: 'Food',
        breakfast: 'Food',
        // Transport
        transport: 'Transport',
        transportation: 'Transport',
        uber: 'Transport',
        taxi: 'Transport',
        gas: 'Transport',
        fuel: 'Transport',
        car: 'Transport',
        parking: 'Transport',
        // Utilities
        utilities: 'Utilities',
        bills: 'Utilities',
        electricity: 'Utilities',
        water: 'Utilities',
        internet: 'Utilities',
        phone: 'Utilities',
        rent: 'Utilities',
        housing: 'Utilities',
        // Entertainment
        entertainment: 'Entertainment',
        movies: 'Entertainment',
        games: 'Entertainment',
        streaming: 'Entertainment',
        subscription: 'Entertainment',
        netflix: 'Entertainment',
        spotify: 'Entertainment',
        // Healthcare
        healthcare: 'Healthcare',
        medical: 'Healthcare',
        pharmacy: 'Healthcare',
        doctor: 'Healthcare',
        health: 'Healthcare',
        medicine: 'Healthcare',
        // Shopping
        shopping: 'Shopping',
        clothes: 'Shopping',
        electronics: 'Shopping',
        amazon: 'Shopping',
        online: 'Shopping',
        // Salary/Income
        salary: 'Salary',
        income: 'Salary',
        payment: 'Salary',
        freelance: 'Salary',
        bonus: 'Salary',
        paycheck: 'Salary',
    };

    const normalized = apiCategory.toLowerCase();
    return categoryMap[normalized] || 'Other';
}
