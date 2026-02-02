import { subDays } from 'date-fns';
import { SubscriptionWithPlan } from '@/lib/subscriptions/types';

export function applyHistoryLimit(subscription: SubscriptionWithPlan, requestedStartDate?: Date): Date | undefined {
    const days = subscription.plan.features.historyDays;

    if (days === Infinity) {
        return requestedStartDate;
    }

    const limitDate = subDays(new Date(), days);

    if (!requestedStartDate) {
        return limitDate;
    }

    return requestedStartDate < limitDate ? limitDate : requestedStartDate;
}
