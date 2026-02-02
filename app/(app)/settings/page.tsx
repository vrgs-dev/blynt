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

const DEFAULT_NOTIFICATIONS: NotificationOption[] = [
    {
        id: 'updates',
        label: 'Updates',
        description: 'Get notified when new updates are released',
        enabled: true,
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
];

export default function SettingsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(currentTab);
    const [name, setName] = useState(session?.user?.name || '');
    const [notifications, setNotifications] = useState<NotificationOption[]>(DEFAULT_NOTIFICATIONS);

    const currentPlanName = 'Free';

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
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, enabled: !notif.enabled } : notif)),
        );
    };

    const handleSaveProfile = () => {
        console.log('Saving profile:', name);
    };

    const handleResetProfile = () => {
        setName(session?.user?.name || '');
    };

    const handleDeleteAccount = () => {
        console.log('Delete account requested');
    };

    return (
        <div className='flex h-full flex-col space-y-6 bg-background p-4 sm:p-6 lg:p-8'>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <h1 className='text-2xl font-black tracking-tight sm:text-3xl'>Settings</h1>
                <p className='text-muted-foreground'>Manage your account and preferences</p>
            </motion.div>

            {/* Main Container */}
            <motion.div
                className='flex min-h-0 flex-1 flex-col gap-6 lg:flex-row'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                <SettingsNav activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Content Area */}
                <div className='min-h-0 flex-1 overflow-y-auto rounded-2xl border-2 border-border bg-card p-4 shadow-[4px_4px_0px_0px] shadow-foreground/5 sm:p-6 lg:p-8'>
                    {activeTab === 'profile' && (
                        <ProfileTab
                            name={name}
                            email={session?.user?.email || ''}
                            planName={currentPlanName}
                            onNameChange={setName}
                            onReset={handleResetProfile}
                            onSave={handleSaveProfile}
                        />
                    )}

                    {activeTab === 'security' && <SecurityTab />}

                    {activeTab === 'notifications' && (
                        <NotificationsTab notifications={notifications} onToggle={toggleNotification} />
                    )}

                    {activeTab === 'subscription' && <SubscriptionTab currentPlanName={currentPlanName} />}

                    {activeTab === 'danger' && <DangerTab onDeleteAccount={handleDeleteAccount} />}
                </div>
            </motion.div>
        </div>
    );
}
