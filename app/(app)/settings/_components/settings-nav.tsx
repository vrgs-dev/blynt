'use client';

import * as motion from 'motion/react-client';
import { User, Shield, Bell, CreditCard, AlertTriangle, ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabConfig {
    id: string;
    label: string;
    icon: LucideIcon;
    description: string;
}

const TABS_CONFIG: TabConfig[] = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Your personal information' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & authentication' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email & push alerts' },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, description: 'Plan & billing' },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, description: 'Delete account' },
];

interface SettingsNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
    return (
        <nav className='w-full shrink-0 lg:w-64'>
            <div className='flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0'>
                {TABS_CONFIG.map((tab, index) => (
                    <NavItem
                        key={tab.id}
                        tab={tab}
                        index={index}
                        isActive={activeTab === tab.id}
                        onClick={() => onTabChange(tab.id)}
                    />
                ))}
            </div>
        </nav>
    );
}

interface NavItemProps {
    tab: TabConfig;
    index: number;
    isActive: boolean;
    onClick: () => void;
}

function NavItem({ tab, index, isActive, onClick }: NavItemProps) {
    const Icon = tab.icon;
    const isDanger = tab.id === 'danger';

    return (
        <motion.button
            onClick={onClick}
            className={cn(
                'group flex min-w-max items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all lg:min-w-0 lg:w-full',
                isActive
                    ? isDanger
                        ? 'border-destructive/50 bg-destructive/5 shadow-[3px_3px_0px_0px] shadow-destructive/20'
                        : 'border-primary/50 bg-primary/5 shadow-[3px_3px_0px_0px] shadow-primary/20'
                    : 'border-border bg-card hover:border-border hover:bg-muted/50 hover:shadow-[2px_2px_0px_0px] hover:shadow-foreground/5',
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
        >
            <div
                className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                    isActive
                        ? isDanger
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                        : isDanger
                          ? 'bg-destructive/5 text-destructive/70 group-hover:bg-destructive/10 group-hover:text-destructive'
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                )}
            >
                <Icon className='size-4' />
            </div>
            <div className='hidden flex-1 lg:block'>
                <p
                    className={cn(
                        'font-semibold',
                        isDanger && 'text-destructive',
                        isActive && !isDanger && 'text-primary',
                    )}
                >
                    {tab.label}
                </p>
                <p className='text-xs text-muted-foreground'>{tab.description}</p>
            </div>
            <ChevronRight
                className={cn(
                    'hidden size-4 text-muted-foreground transition-transform lg:block',
                    isActive && 'translate-x-1 text-primary',
                )}
            />
        </motion.button>
    );
}
