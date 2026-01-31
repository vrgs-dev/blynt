'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Transaction } from '@/types/transaction';
import { CATEGORIES } from '@/constants/category';
import { Calendar, DollarSign, FileText, Tag } from 'lucide-react';

interface TransactionEditModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Transaction) => void;
}

export function TransactionEditModal({ transaction, isOpen, onClose, onSave }: TransactionEditModalProps) {
    const [formData, setFormData] = useState<Transaction>({
        id: '',
        type: 'expense',
        amount: 0,
        currency: 'USD',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    useEffect(() => {
        if (transaction) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(transaction);
        }
    }, [transaction]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (field: keyof Transaction, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='bg-card shadow-[6px_6px_0px_0px] shadow-foreground/10 p-0 border-2 border-border rounded-2xl max-w-md overflow-hidden'>
                <DialogTitle className='sr-only'>{transaction ? 'Edit Transaction' : 'Create Transaction'}</DialogTitle>
                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-5 px-6 py-6'>
                    {/* Type Toggle */}
                    <div className='space-y-2'>
                        <label className='font-bold text-foreground text-xs uppercase tracking-wider'>
                            Transaction Type
                        </label>
                        <div className='gap-2 grid grid-cols-2 bg-muted/50 p-1 border-2 border-border/50 rounded-xl'>
                            <button
                                type='button'
                                onClick={() => handleChange('type', 'expense')}
                                className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                                    formData.type === 'expense'
                                        ? 'bg-card shadow-[2px_2px_0px_0px] shadow-foreground/5 border-2 border-border text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Expense
                            </button>
                            <button
                                type='button'
                                onClick={() => handleChange('type', 'income')}
                                className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                                    formData.type === 'income'
                                        ? 'bg-card shadow-[2px_2px_0px_0px] shadow-foreground/5 border-2 border-border text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Income
                            </button>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className='space-y-2'>
                        <label htmlFor='amount' className='font-bold text-foreground text-xs uppercase tracking-wider'>
                            Amount
                        </label>
                        <div className='relative'>
                            <DollarSign className='top-1/2 left-4 z-10 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none' />
                            <Input
                                id='amount'
                                type='number'
                                step='0.01'
                                min='0.01'
                                value={formData.amount}
                                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                                placeholder='0.00'
                                required
                                className='pl-11'
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className='space-y-2'>
                        <label
                            htmlFor='category'
                            className='font-bold text-foreground text-xs uppercase tracking-wider'
                        >
                            Category
                        </label>
                        <div className='relative'>
                            <Tag className='top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none' />
                            <select
                                id='category'
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                required
                                className='bg-muted/50 py-2.5 pr-4 pl-10 border-2 border-border/50 focus:border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full font-bold text-foreground text-sm transition-all'
                            >
                                <option value=''>Select category</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div className='space-y-2'>
                        <label htmlFor='date' className='font-bold text-foreground text-xs uppercase tracking-wider'>
                            Date
                        </label>
                        <div className='relative'>
                            <Calendar className='top-1/2 left-4 z-10 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none' />
                            <Input
                                id='date'
                                type='date'
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                required
                                className='pl-11'
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className='space-y-2'>
                        <label
                            htmlFor='description'
                            className='font-bold text-foreground text-xs uppercase tracking-wider'
                        >
                            Description
                        </label>
                        <div className='relative'>
                            <FileText className='top-3 left-4 z-10 absolute size-4 text-muted-foreground pointer-events-none' />
                            <textarea
                                id='description'
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder='Enter transaction details...'
                                required
                                rows={3}
                                className='bg-muted/50 shadow-[2px_2px_0px_0px] shadow-foreground/5 py-2.5 pr-4 pl-11 border-2 border-border focus:border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full h-auto font-medium text-foreground placeholder:text-muted-foreground text-sm transition-all resize-none'
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <DialogFooter className='gap-2 sm:gap-3 pt-4'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={onClose}
                            className='shadow-[2px_2px_0px_0px] shadow-foreground/5 border-2'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='bg-primary hover:bg-primary/90 shadow-[2px_2px_0px_0px] shadow-primary/20 border-2 border-primary/30 font-bold'
                        >
                            {transaction ? 'Update' : 'Create'} Transaction
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
