import { PlanFeatures, PlanTier } from '../subscriptions/types';

export const PLAN_DEFINITIONS: Record<PlanTier, PlanFeatures> = {
    free: {
        maxTransactionsPerMonth: 50,
        naturalLanguage: true,
        csvExport: true,
        historyDays: 7,
    },
    pro: {
        maxTransactionsPerMonth: Infinity,
        naturalLanguage: true,
        csvExport: true,
        historyDays: Infinity,
    },
    team: {
        maxTransactionsPerMonth: Infinity,
        naturalLanguage: true,
        csvExport: true,
        historyDays: Infinity,
    },
};
