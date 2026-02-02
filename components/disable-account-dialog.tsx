'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, Skull } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DisableAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (confirmation: string) => void;
    isLoading?: boolean;
}

export function DisableAccountDialog({ open, onOpenChange, onConfirm, isLoading }: DisableAccountDialogProps) {
    const [confirmation, setConfirmation] = useState('');
    const isValid = confirmation === 'DELETE';

    const handleConfirm = () => {
        if (isValid) {
            onConfirm(confirmation);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setConfirmation('');
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                className='bg-transparent shadow-2xl p-0 border-0 sm:max-w-[460px] overflow-hidden'
            >
                {/* Red Danger Header */}
                <div className='relative bg-linear-to-br from-red-600 via-rose-600 to-red-700 p-6 pb-16'>
                    {/* Decorative pattern */}
                    <div className='absolute inset-0 opacity-30 bg-[url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="none"/%3E%3Ccircle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.2)"/%3E%3C/svg%3E")]' />
                    <div className='-top-20 -right-20 absolute bg-black/10 blur-3xl rounded-full w-40 h-40' />
                    <div className='-bottom-10 -left-10 absolute bg-black/10 blur-2xl rounded-full w-32 h-32' />

                    {/* Close button */}
                    <button
                        onClick={() => handleOpenChange(false)}
                        disabled={isLoading}
                        className='top-4 right-4 absolute flex justify-center items-center bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-full w-8 h-8 text-white transition-colors'
                    >
                        <span className='sr-only'>Close</span>
                        <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                            />
                        </svg>
                    </button>

                    <DialogHeader className='relative text-white'>
                        <div className='flex items-center gap-3 mb-3'>
                            <div className='flex justify-center items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl w-12 h-12'>
                                <Skull className='w-6 h-6' />
                            </div>
                            <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30 rounded-full'>
                                <AlertTriangle className='w-3.5 h-3.5' />
                                <span className='font-bold text-xs uppercase tracking-wider'>Danger</span>
                            </div>
                        </div>
                        <DialogTitle className='font-black text-2xl tracking-tight'>Delete Account</DialogTitle>
                        <DialogDescription className='font-medium text-white/80'>
                            This action is permanent and cannot be undone
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Content Card */}
                <div className='relative mx-4 -mt-10 mb-4'>
                    <div className='bg-card shadow-lg p-5 border-2 border-border rounded-2xl'>
                        {/* Warning message */}
                        <div className='bg-destructive/10 mb-5 p-4 border-2 border-destructive/30 border-dashed rounded-xl'>
                            <div className='flex items-start gap-3'>
                                <div className='flex justify-center items-center bg-destructive/20 rounded-xl w-10 h-10 shrink-0'>
                                    <AlertTriangle className='w-5 h-5 text-destructive' />
                                </div>
                                <div>
                                    <p className='font-bold text-destructive text-sm'>
                                        You are about to delete your account
                                    </p>
                                    <p className='mt-0.5 text-muted-foreground text-xs'>
                                        All your data including transactions, settings, and history will be permanently
                                        deleted.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation input */}
                        <div className='space-y-3'>
                            <p className='font-bold text-[10px] text-muted-foreground uppercase tracking-widest'>
                                Type <span className='font-mono text-destructive'>DELETE</span> to confirm
                            </p>
                            <Input
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
                                placeholder='Type DELETE here'
                                disabled={isLoading}
                                className={cn(
                                    'border-2 font-mono text-center text-lg tracking-widest',
                                    isValid ? 'border-destructive bg-destructive/5 text-destructive' : 'border-border',
                                )}
                            />
                        </div>

                        <DialogFooter className='flex-col sm:flex-col gap-2 mt-6'>
                            <Button
                                variant='destructive'
                                onClick={handleConfirm}
                                disabled={!isValid || isLoading}
                                className={cn(
                                    'rounded-xl w-full h-12 font-bold text-base',
                                    'shadow-lg transition-all',
                                    isValid && !isLoading && 'hover:scale-[1.02] active:scale-[0.98]',
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 w-5 h-5 animate-spin' />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Skull className='mr-2 w-5 h-5' />
                                        Delete My Account Forever
                                    </>
                                )}
                            </Button>
                            <button
                                onClick={() => handleOpenChange(false)}
                                disabled={isLoading}
                                className='disabled:opacity-50 py-2 font-medium text-muted-foreground hover:text-foreground text-sm transition-colors'
                            >
                                Cancel, keep my account
                            </button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DisableAccountDialog;
