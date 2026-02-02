import { SubscriptionWithPlan } from '@/lib/subscriptions/types';
import { PLAN_DEFINITIONS } from './plans';
import { getMonthlyTransactionCount } from './usage';

export async function canCreateTransactions(
    subscription: SubscriptionWithPlan,
    userId: string,
    amountToCreate: number,
): Promise<boolean> {
    const plan = PLAN_DEFINITIONS[subscription.plan.tier];

    if (plan.maxTransactionsPerMonth === Infinity) return true;

    const used = await getMonthlyTransactionCount(
        userId,
        subscription.currentPeriodStart,
        subscription.currentPeriodEnd,
    );

    return used + amountToCreate <= plan.maxTransactionsPerMonth;
}
