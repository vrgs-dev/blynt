'use client';

import * as motion from 'motion/react-client';
import { useSession } from '@/lib/auth-client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    SettingsNav,
    ProfileTab,
    SecurityTab,
    NotificationsTab,
    SubscriptionTab,
    DangerTab,
    type NotificationOption,
} from './_components';
import { useSettings, useUpdateSettings, useDisableAccount, useSubscription } from '@/lib/api/hooks';
import { DisableAccountDialog } from '@/components/disable-account-dialog';
import { authClient } from '@/lib/auth-client';

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(currentTab);
    const [name, setName] = useState(session?.user?.name || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: settingsData } = useSettings();
    const { data: subscriptionData } = useSubscription();

    const currentPlanName = subscriptionData?.plan.tier
        ? subscriptionData.plan.tier.charAt(0).toUpperCase() + subscriptionData.plan.tier.slice(1)
        : 'Free';

    // Build notifications from settings
    const [notifications, setNotifications] = useState<NotificationOption[]>([
        {
            id: 'updates',
            label: 'Updates',
            description: 'Get notified when new updates are released',
            enabled: false,
        },
        {
            id: 'reports',
            label: 'Weekly Reports',
            description: 'Get weekly summaries of your spending',
            enabled: false,
        },
        {
            id: 'tips',
            label: 'Money Tips',
            description: 'Receive personalized savings recommendations',
            enabled: false,
        },
    ]);

    // Update notifications when settings load
    useEffect(() => {
        if (settingsData?.settings?.notifications) {
            const notifSettings = settingsData.settings.notifications;
            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    enabled: notifSettings[n.id as keyof typeof notifSettings] ?? false,
                })),
            );
        }
    }, [settingsData]);

    // Mutations
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const { mutate: updateSettings, isPending: isSavingSettings } = useUpdateSettings({
        onSuccess: () => {
            setSaveMessage({ type: 'success', text: 'Settings saved!' });
            setTimeout(() => setSaveMessage(null), 3000);
        },
        onError: () => {
            setSaveMessage({ type: 'error', text: 'Failed to save settings' });
            setTimeout(() => setSaveMessage(null), 3000);
        },
    });

    const { mutate: disableAccount, isPending: isDisabling } = useDisableAccount({
        onSuccess: async () => {
            await authClient.signOut();
            router.push('/');
        },
        onError: (error) => {
            setSaveMessage({ type: 'error', text: error.message || 'Failed to delete account' });
            setTimeout(() => setSaveMessage(null), 3000);
            setShowDeleteDialog(false);
        },
    });

    useEffect(() => {
        setActiveTab(currentTab);
    }, [currentTab]);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session?.user?.name]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`${pathname}?tab=${value}`);
    };

    const toggleNotification = (id: string) => {
        const newNotifications = notifications.map((notif) =>
            notif.id === id ? { ...notif, enabled: !notif.enabled } : notif,
        );
        setNotifications(newNotifications);

        // Save to backend
        const notifSettings = {
            tips: newNotifications.find((n) => n.id === 'tips')?.enabled ?? false,
            reports: newNotifications.find((n) => n.id === 'reports')?.enabled ?? false,
            updates: newNotifications.find((n) => n.id === 'updates')?.enabled ?? false,
        };
        updateSettings({ notifications: notifSettings });
    };

    const handleSaveProfile = () => {
        updateSettings({ name });
    };

    const handleResetProfile = () => {
        setName(session?.user?.name || '');
    };

    const handleDeleteAccount = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = (confirmation: string) => {
        disableAccount(confirmation);
    };

    return (
        <div className='flex flex-col space-y-6 bg-background p-4 sm:p-6 lg:p-8 h-full'>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className='font-black text-2xl sm:text-3xl tracking-tight'>Settings</h1>
                        <p className='text-muted-foreground'>Manage your account and preferences</p>
                    </div>
                    {/* Save status indicator */}
                    {saveMessage && (
                        <div
                            className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm animate-in fade-in slide-in-from-right-2 ${
                                saveMessage.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                        >
                            {saveMessage.text}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Main Container */}
            <motion.div
                className='flex lg:flex-row flex-col flex-1 gap-6 min-h-0'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <SettingsNav activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Content Area */}
                <div className='flex-1 bg-card shadow-[4px_4px_0px_0px] shadow-foreground/5 p-4 sm:p-6 lg:p-8 border-2 border-border rounded-2xl min-h-0 overflow-y-auto'>
                    {activeTab === 'profile' && (
                        <ProfileTab
                            name={name}
                            email={session?.user?.email || ''}
                            planName={currentPlanName}
                            onNameChange={setName}
                            onReset={handleResetProfile}
                            onSave={handleSaveProfile}
                            isSaving={isSavingSettings}
                        />
                    )}

                    {activeTab === 'security' && <SecurityTab />}

                    {activeTab === 'notifications' && (
                        <NotificationsTab notifications={notifications} onToggle={toggleNotification} />
                    )}

                    {activeTab === 'subscription' && <SubscriptionTab />}

                    {activeTab === 'danger' && <DangerTab onDeleteAccount={handleDeleteAccount} />}
                </div>
            </motion.div>

            {/* Delete Account Confirmation Dialog */}
            <DisableAccountDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleConfirmDelete}
                isLoading={isDisabling}
            />
        </div>
    );
}
