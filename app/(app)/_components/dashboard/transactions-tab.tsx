'use client';

import { useState } from 'react';
import TransactionList from './transaction-list';
import { Transaction } from './types';
import { MOCK_TRANSACTIONS } from '@/constants/mocks';

export function TransactionsTab() {
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

    const handleDeleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
            title='All Transactions'
            showEmpty={true}
        />
    );
}
