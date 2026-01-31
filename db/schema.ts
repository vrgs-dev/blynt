import { pgEnum, pgTable, uuid, text, decimal, varchar, date, timestamp, index } from 'drizzle-orm/pg-core';

export const TransactionType = pgEnum('transaction_type', ['income', 'expense']);

export const transaction = pgTable(
    'transactions',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        type: TransactionType('type').notNull(),
        amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
        currency: varchar('currency', { length: 3 }).notNull().default('USD'),
        category: varchar('category', { length: 100 }).notNull(),

        date: date('date').notNull(),
        description: varchar('description', { length: 255 }),
        rawInput: text('raw_input'),

        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow(),
    },
    (table) => [index('transactions_type_date_idx').on(table.type, table.date)],
);
