import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getActiveSubscription } from '@/lib/subscriptions/getActiveSubscription';
import { PLAN_DEFINITIONS } from '@/lib/billing/plans';
import { getMonthlyTransactionCount } from '@/lib/billing/usage';

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscription = await getActiveSubscription(session.user.id);

        if (!subscription) {
            // Return default free plan info
            return NextResponse.json({
                subscription: null,
                plan: {
                    tier: 'free',
                    features: PLAN_DEFINITIONS.free,
                },
                usage: {
                    transactionsUsed: 0,
                    transactionsLimit: PLAN_DEFINITIONS.free.maxTransactionsPerMonth,
                },
            });
        }

        const transactionsUsed = await getMonthlyTransactionCount(
            session.user.id,
            subscription.currentPeriodStart,
            subscription.currentPeriodEnd,
        );

        const planDef = PLAN_DEFINITIONS[subscription.plan.tier];

        return NextResponse.json({
            subscription: {
                id: subscription.id,
                status: subscription.status,
                currentPeriodStart: subscription.currentPeriodStart,
                currentPeriodEnd: subscription.currentPeriodEnd,
            },
            plan: {
                tier: subscription.plan.tier,
                interval: subscription.plan.interval,
                features: planDef,
            },
            usage: {
                transactionsUsed,
                transactionsLimit: planDef.maxTransactionsPerMonth,
            },
        });
    } catch (error) {
        console.error('[API Error]', error instanceof Error ? error.message : 'Unknown error');
        return NextResponse.json({ error: 'Something went wrong, please try again' }, { status: 500 });
    }
}
