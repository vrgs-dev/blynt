import { db } from '@/db';
import { plans, planFeatures, subscriptions } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { SubscriptionWithPlan } from './types';

export function parseFeatureValue(value: string): boolean | number | string {
    if (value === 'true') return true;
    if (value === 'false') return false;

    const num = Number(value);
    if (!Number.isNaN(num)) return num;

    return value;
}

export async function getActiveSubscription(userId: string): Promise<SubscriptionWithPlan | null> {
    const rows = await db
        .select()
        .from(subscriptions)
        .innerJoin(plans, eq(plans.id, subscriptions.planId))
        .leftJoin(planFeatures, eq(planFeatures.planId, plans.id))
        .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, 'active')));

    if (rows.length === 0) return null;

    const { subscriptions: sub, plans: plan } = rows[0];

    const features = rows.reduce<Record<string, boolean | number | string>>((acc, row) => {
        const feature = row.plan_features;
        if (!feature) return acc;

        acc[feature.feature] = parseFeatureValue(feature.value);
        return acc;
    }, {});

    return {
        id: sub.id,
        userId: sub.userId,
        status: sub.status as SubscriptionWithPlan['status'],
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        plan: {
            id: plan.id,
            tier: plan.tier as SubscriptionWithPlan['plan']['tier'],
            interval: plan.interval as SubscriptionWithPlan['plan']['interval'],
            features: features as SubscriptionWithPlan['plan']['features'],
        },
    };
}
