export type PlanTier = 'free' | 'pro' | 'team';

export type PlanFeatures = {
    naturalLanguage: boolean;
    csvExport: boolean;
    historyDays: number;
    maxTransactionsPerMonth: number;
};

export type Plan = {
    id: string;
    tier: 'free' | 'pro' | 'team';
    interval: 'monthly' | 'yearly';
    features: PlanFeatures;
};

export type SubscriptionWithPlan = {
    id: string;
    userId: string;
    status: 'active' | 'trial' | 'inactive' | 'past_due';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    plan: Plan;
};
