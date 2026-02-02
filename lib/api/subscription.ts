import { api } from './axios';
import type { PlanTier, PlanFeatures } from '@/lib/subscriptions/types';

export interface SubscriptionResponse {
    subscription: {
        id: string;
        status: 'active' | 'trial' | 'inactive' | 'past_due';
        currentPeriodStart: string;
        currentPeriodEnd: string;
    } | null;
    plan: {
        tier: PlanTier;
        interval?: 'monthly' | 'yearly';
        features: PlanFeatures;
    };
    usage: {
        transactionsUsed: number;
        transactionsLimit: number;
    };
}

export async function getSubscription(): Promise<SubscriptionResponse> {
    const response = await api.get<SubscriptionResponse>('/subscription');
    return response.data;
}
