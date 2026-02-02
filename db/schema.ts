import {
    pgEnum,
    pgTable,
    uuid,
    text,
    decimal,
    varchar,
    date,
    timestamp,
    index,
    boolean,
    jsonb,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),

    role: text('role').default('customer'),
    disabled: boolean('disabled').default(false),
});

export const sessions = pgTable(
    'sessions',
    {
        id: text('id').primaryKey(),
        expiresAt: timestamp('expires_at').notNull(),
        token: text('token').notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
    },
    (table) => [index('sessions_userId_idx').on(table.userId)],
);

export const accounts = pgTable(
    'accounts',
    {
        id: text('id').primaryKey(),
        accountId: text('account_id').notNull(),
        providerId: text('provider_id').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        accessToken: text('access_token'),
        refreshToken: text('refresh_token'),
        idToken: text('id_token'),
        accessTokenExpiresAt: timestamp('access_token_expires_at'),
        refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
        scope: text('scope'),
        password: text('password'),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index('accounts_userId_idx').on(table.userId)],
);

export const verifications = pgTable(
    'verifications',
    {
        id: text('id').primaryKey(),
        identifier: text('identifier').notNull(),
        value: text('value').notNull(),
        expiresAt: timestamp('expires_at').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index('verifications_identifier_idx').on(table.identifier)],
);

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    users: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    users: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const TransactionType = pgEnum('transaction_type', ['income', 'expense']);

export const transactions = pgTable(
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

        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow(),
    },
    (table) => [index('transactions_type_date_idx').on(table.type, table.date)],
);

export const planInterval = pgEnum('plan_interval', ['monthly', 'yearly']);
export const planTier = pgEnum('plan_tier', ['free', 'pro', 'team']);

export const plans = pgTable(
    'plans',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        tier: planTier('tier').notNull(),
        price: decimal('price', { precision: 12, scale: 2 }).notNull(),
        currency: varchar('currency', { length: 3 }).notNull().default('USD'),
        interval: planInterval('interval').notNull(),
        isActive: boolean('is_active').default(true).notNull(),
        isPopular: boolean('is_popular').default(false).notNull(),
        description: varchar('description', { length: 255 }),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow(),
    },
    (table) => [index('plans_tier_idx').on(table.tier)],
);

export const planFeatures = pgTable(
    'plan_features',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        planId: uuid('plan_id')
            .notNull()
            .references(() => plans.id, { onDelete: 'cascade' }),
        feature: varchar('feature', { length: 100 }).notNull(), // transaction request, ai insights, custom categories, export data
        value: varchar('value', { length: 100 }).notNull(), // 10, true, unlimited
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow(),
    },
    (table) => [index('plan_features_planId_idx').on(table.planId)],
);

export const subscriptions = pgTable(
    'subscriptions',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        planId: uuid('plan_id')
            .notNull()
            .references(() => plans.id, { onDelete: 'cascade' }),
        status: varchar('status', { length: 100 }).notNull(), // active, inactive, trial, past_due
        currentPeriodStart: timestamp('current_period_start').notNull(),
        currentPeriodEnd: timestamp('current_period_end').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow(),
    },
    (table) => [index('subscriptions_userId_idx').on(table.userId)],
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    user: one(users, {
        fields: [subscriptions.userId],
        references: [users.id],
    }),
    plan: one(plans, {
        fields: [subscriptions.planId],
        references: [plans.id],
    }),
}));

export const settings = pgTable(
    'settings',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        key: varchar('key', { length: 100 }).notNull(), // currency, timezone, language, notifications
        value: jsonb('value').notNull(), // USD, UTC, en, true
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow(),
    },
    (table) => [index('settings_userId_idx').on(table.userId), index('settings_key_idx').on(table.key)],
);

export const settingsRelations = relations(settings, ({ one }) => ({
    user: one(users, {
        fields: [settings.userId],
        references: [users.id],
    }),
}));

export const notifications = pgTable(
    'notifications',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        title: varchar('title', { length: 100 }).notNull(),
        message: varchar('message', { length: 255 }).notNull(),
        type: varchar('type', { length: 100 }).notNull(), // info, warning, error, success
        read: boolean('read').default(false).notNull(),
        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow(),
    },
    (table) => [index('notifications_userId_idx').on(table.userId)],
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));
