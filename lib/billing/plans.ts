import { PlanFeatures, PlanTier } from '../subscriptions/types';

export const PLAN_DEFINITIONS: Record<PlanTier, PlanFeatures> = {
    free: {
        maxTransactionsPerMonth: 50,
        naturalLanguage: true,
        csvExport: true,
        historyDays: 7,
    },
    pro: {
        maxTransactionsPerMonth: 999999,
        naturalLanguage: true,
        csvExport: true,
        historyDays: 999999,
    },
    team: {
        maxTransactionsPerMonth: 999999,
        naturalLanguage: true,
        csvExport: true,
        historyDays: 999999,
    },
};
