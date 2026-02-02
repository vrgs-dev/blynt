import { api } from './axios';

export interface NotificationSettings {
    tips: boolean;
    reports: boolean;
    updates: boolean;
}

export interface UserSettings {
    currency: string;
    timezone: string;
    locale: string;
    notifications: NotificationSettings;
}

export interface GetSettingsResponse {
    settings: UserSettings;
}

export interface UpdateSettingsRequest {
    name?: string;
    currency?: string;
    timezone?: string;
    locale?: string;
    notifications?: NotificationSettings;
}

export async function getSettings(): Promise<GetSettingsResponse> {
    const response = await api.get<GetSettingsResponse>('/settings');
    return response.data;
}

export async function updateSettings(data: UpdateSettingsRequest): Promise<{ success: boolean }> {
    const response = await api.put<{ success: boolean }>('/settings', data);
    return response.data;
}

export async function disableAccount(confirmation: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/account/disable', {
        confirmation,
    });
    return response.data;
}

export async function checkDisableAccount(): Promise<{ success: boolean; message: string }> {
    const response = await api.get<{ success: boolean; message: string }>('/account/disable');
    return response.data;
}

export async function enableAccount(confirmation: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>('/account/enable', {
        confirmation,
    });
    return response.data;
}
