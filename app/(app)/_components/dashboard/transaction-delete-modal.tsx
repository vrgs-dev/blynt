'use client';

import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface TransactionDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    transactionDescription?: string;
}

export function TransactionDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    transactionDescription,
}: TransactionDeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className='bg-card shadow-[6px_6px_0px_0px] shadow-foreground/10 p-0 border-2 border-border rounded-2xl max-w-sm overflow-hidden'
                showCloseButton={false}
            >
                <DialogTitle className='sr-only'>
                    {transactionDescription ? 'Delete Transaction' : 'Create Transaction'}
                </DialogTitle>
                {/* Content */}
                <div className='space-y-4 px-6 py-8 text-center'>
                    {/* Icon */}
                    <div className='mx-auto w-fit'>
                        <div className='bg-destructive/10 p-4 border-2 border-destructive/20 rounded-2xl'>
                            <AlertTriangle className='size-8 text-destructive' />
                        </div>
                    </div>

                    {/* Text */}
                    <div className='space-y-2'>
                        <h3 className='font-black text-foreground text-lg tracking-tight'>Delete Transaction?</h3>
                        <p className='mx-auto max-w-xs text-muted-foreground text-sm leading-relaxed'>
                            {transactionDescription ? (
                                <>
                                    <span className='font-bold text-foreground'>
                                        &quot;{transactionDescription}&quot;
                                    </span>{' '}
                                    will be permanently removed
                                </>
                            ) : (
                                'This transaction will be permanently removed'
                            )}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className='gap-2 px-6 py-4 border-border/50 border-t-2'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onClose}
                        className='flex-1 shadow-[2px_2px_0px_0px] shadow-foreground/5 border-2 font-semibold'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        variant='destructive'
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className='flex-1 bg-destructive hover:bg-destructive/90 shadow-[2px_2px_0px_0px] shadow-destructive/20 border-2 border-destructive/30 font-bold'
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
