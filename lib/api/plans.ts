import { api } from './axios';

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

export interface GetPlansResponse {
    plans: {
        monthly: PlanWithFeatures[];
        yearly: PlanWithFeatures[];
    };
}

export async function getPlans(): Promise<GetPlansResponse> {
    const response = await api.get<GetPlansResponse>('/plans');
    return response.data;
}
