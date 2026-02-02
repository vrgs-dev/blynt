import { db } from './index';
import { planFeatures, plans } from './schema';

async function seed() {
    await db.transaction(async (tx) => {
        // 1. Insert plans
        const insertedPlans = await tx
            .insert(plans)
            .values([
                // MONTHLY
                {
                    tier: 'free',
                    price: '0.00',
                    interval: 'monthly',
                    description: 'See if it clicks',
                },
                {
                    tier: 'pro',
                    price: '5.00',
                    interval: 'monthly',
                    description: 'For daily trackers',
                    isPopular: true,
                },
                {
                    tier: 'team',
                    price: '12.00',
                    interval: 'monthly',
                    description: 'Track together',
                },

                // YEARLY
                {
                    tier: 'pro',
                    price: '50.00',
                    interval: 'yearly',
                    description: 'Pro billed yearly',
                    isPopular: true,
                },
                {
                    tier: 'team',
                    price: '120.00',
                    interval: 'yearly',
                    description: 'Team billed yearly',
                },
            ])
            .returning({
                id: plans.id,
                tier: plans.tier,
                interval: plans.interval,
            });

        const planId = (tier: 'free' | 'pro' | 'team', interval: 'monthly' | 'yearly') =>
            insertedPlans.find((p) => p.tier === tier && p.interval === interval)?.id;

        // 2. Insert features
        await tx.insert(planFeatures).values([
            // ───────────────── FREE ─────────────────
            {
                planId: planId('free', 'monthly')!,
                feature: 'transactions_per_month',
                value: '50',
            },
            {
                planId: planId('free', 'monthly')!,
                feature: 'natural_language_input',
                value: 'true',
            },
            {
                planId: planId('free', 'monthly')!,
                feature: 'auto_categorization',
                value: 'true',
            },
            {
                planId: planId('free', 'monthly')!,
                feature: 'csv_export',
                value: 'true',
            },
            {
                planId: planId('free', 'monthly')!,
                feature: 'history_days',
                value: '7',
            },

            // ───────────── PRO (monthly & yearly) ─────────────
            ...(['monthly', 'yearly'] as const).flatMap((interval) => [
                {
                    planId: planId('pro', interval)!,
                    feature: 'transactions_per_month',
                    value: 'unlimited',
                },
                {
                    planId: planId('pro', interval)!,
                    feature: 'natural_language_input',
                    value: 'true',
                },
                {
                    planId: planId('pro', interval)!,
                    feature: 'advanced_categorization',
                    value: 'true',
                },
                {
                    planId: planId('pro', interval)!,
                    feature: 'ai_insights',
                    value: 'true',
                },
                {
                    planId: planId('pro', interval)!,
                    feature: 'csv_export',
                    value: 'true',
                },
                {
                    planId: planId('pro', interval)!,
                    feature: 'history_days',
                    value: 'unlimited',
                },
                {
                    planId: planId('pro', interval)!,
                    feature: 'priority_support',
                    value: 'true',
                },
            ]),

            // ───────────── TEAM (monthly & yearly) ─────────────
            ...(['monthly', 'yearly'] as const).flatMap((interval) => [
                {
                    planId: planId('team', interval)!,
                    feature: 'transactions_per_month',
                    value: 'unlimited',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'natural_language_input',
                    value: 'true',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'advanced_categorization',
                    value: 'true',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'ai_insights',
                    value: 'true',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'csv_export',
                    value: 'true',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'history_days',
                    value: 'unlimited',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'team_members',
                    value: '5',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'shared_workspaces',
                    value: 'true',
                },
                {
                    planId: planId('team', interval)!,
                    feature: 'team_analytics',
                    value: 'true',
                },
            ]),
        ]);
    });

    console.log('✅ Pricing rules seeded');
}

seed().catch((err) => {
    console.error('❌ Seed failed', err);
    process.exit(1);
});
