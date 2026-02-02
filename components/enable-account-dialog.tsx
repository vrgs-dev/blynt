'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useEnableAccount } from '@/lib/api/hooks/use-settings';

interface EnableAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EnableAccountDialog({ open, onOpenChange }: EnableAccountDialogProps) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useEnableAccount({
        onSuccess: () => {
            toast.success('Account reactivated successfully');
            queryClient.invalidateQueries({ queryKey: ['checkDisableAccount'] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Failed to reactivate account');
        },
    });

    const handleConfirm = () => {
        mutate('REACTIVATE');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Activate Account</DialogTitle>
                    <DialogDescription>
                        Your account is currently disabled. Activate it to regain access to your data and continue using
                        the application.
                    </DialogDescription>
                </DialogHeader>

                <div className='py-4'>
                    <p className='text-sm text-muted-foreground'>
                        By clicking &quot;Activate Account&quot;, your access will be restored immediately.
                    </p>
                </div>

                <DialogFooter>
                    <Button onClick={handleConfirm} disabled={isPending} className='w-full sm:w-auto'>
                        {isPending && <Loader2 className='mr-2 w-4 h-4 animate-spin' />}
                        Activate Account
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
