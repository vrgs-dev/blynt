import { differenceInDays, parseISO, startOfDay } from 'date-fns';
import { PlanTier } from '@/lib/subscriptions/types';
import { PLAN_DEFINITIONS } from './plans';

export interface DateRangeValidation {
    isValid: boolean;
    maxDays: number;
    requestedDays: number;
    requiresUpgrade: boolean;
}

export function validateDateRange(
    tier: PlanTier,
    startDate?: string | Date,
    endDate?: string | Date,
): DateRangeValidation {
    const plan = PLAN_DEFINITIONS[tier];
    const maxDays = plan.historyDays;

    // Pro and Team have unlimited history
    if (maxDays === Infinity) {
        return {
            isValid: true,
            maxDays: Infinity,
            requestedDays: 0,
            requiresUpgrade: false,
        };
    }

    const today = startOfDay(new Date());
    const start = startDate ? startOfDay(typeof startDate === 'string' ? parseISO(startDate) : startDate) : today;
    const end = endDate ? startOfDay(typeof endDate === 'string' ? parseISO(endDate) : endDate) : today;

    const requestedDays = Math.abs(differenceInDays(end, start)) + 1;

    return {
        isValid: requestedDays <= maxDays,
        maxDays,
        requestedDays,
        requiresUpgrade: requestedDays > maxDays,
    };
}

export function getMaxAllowedStartDate(tier: PlanTier): Date {
    const plan = PLAN_DEFINITIONS[tier];

    if (plan.historyDays === Infinity) {
        return new Date(1970, 0, 1); // Essentially unlimited
    }

    const today = new Date();
    today.setDate(today.getDate() - plan.historyDays + 1);
    return startOfDay(today);
}
