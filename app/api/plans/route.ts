import { NextResponse } from 'next/server';
import { db } from '@/db';
import { plans, planFeatures } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface PlanWithFeatures {
    id: string;
    tier: 'free' | 'pro' | 'team';
    price: string;
    currency: string;
    interval: 'monthly' | 'yearly';
    isActive: boolean;
    isPopular: boolean;
    description: string | null;
    features: Record<string, string>;
}

export async function GET() {
    try {
        // Get all active plans with their features
        const allPlans = await db.select().from(plans).where(eq(plans.isActive, true));

        const plansWithFeatures: PlanWithFeatures[] = await Promise.all(
            allPlans.map(async (plan) => {
                const features = await db.select().from(planFeatures).where(eq(planFeatures.planId, plan.id));

                const featuresMap: Record<string, string> = {};
                for (const feature of features) {
                    featuresMap[feature.feature] = feature.value;
                }

                return {
                    id: plan.id,
                    tier: plan.tier as 'free' | 'pro' | 'team',
                    price: plan.price,
                    currency: plan.currency,
                    interval: plan.interval as 'monthly' | 'yearly',
                    isActive: plan.isActive,
                    isPopular: plan.isPopular,
                    description: plan.description,
                    features: featuresMap,
                };
            }),
        );

        // Group by tier and interval for easier consumption
        const grouped = {
            monthly: plansWithFeatures.filter((p) => p.interval === 'monthly'),
            yearly: plansWithFeatures.filter((p) => p.interval === 'yearly'),
        };

        return NextResponse.json({ plans: grouped });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
