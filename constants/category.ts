import { Category } from '@/types/category';

export const CATEGORIES: Category[] = [
    'Food',
    'Transport',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Salary',
    'Other',
];

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
    Food: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    Transport: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    Utilities: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    Entertainment: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    Healthcare: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
    Shopping: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    Salary: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    Other: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
};

export const DEFAULT_COLORS = { bar: 'bg-primary', bg: 'bg-primary/20', text: 'text-primary' };
