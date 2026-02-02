'use client';

import * as motion from 'motion/react-client';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '../../../../components/animations';

export interface NotificationOption {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

interface NotificationsTabProps {
    notifications: NotificationOption[];
    onToggle: (id: string) => void;
}

export function NotificationsTab({ notifications, onToggle }: NotificationsTabProps) {
    return (
        <motion.div className='space-y-6' variants={staggerContainer} initial='hidden' animate='visible'>
            <motion.div variants={fadeInUp}>
                <h2 className='text-xl font-bold'>Notification Preferences</h2>
                <p className='text-sm text-muted-foreground'>Choose how and when you want to be notified</p>
            </motion.div>

            <div className='space-y-3'>
                {notifications.map((notif, index) => (
                    <motion.div
                        key={notif.id}
                        variants={fadeInUp}
                        custom={index}
                        className={cn(
                            'flex items-center justify-between gap-4 rounded-xl border-2 p-4 transition-all sm:p-5',
                            notif.enabled
                                ? 'border-primary/30 bg-primary/5'
                                : 'border-border bg-background hover:border-muted-foreground/20',
                        )}
                        whileHover={{ x: 2 }}
                    >
                        <div className='min-w-0 flex-1'>
                            <p className='font-semibold'>{notif.label}</p>
                            <p className='text-sm text-muted-foreground'>{notif.description}</p>
                        </div>
                        <Switch checked={notif.enabled} onCheckedChange={() => onToggle(notif.id)} />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
