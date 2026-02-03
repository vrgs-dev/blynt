import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const initials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
};

export function formatCurrency(amount: number, decimals: number = 2): string {
    // Convert to number in case it's a string or other type
    const numAmount = Number(amount);

    // Handle NaN or invalid numbers
    if (isNaN(numAmount)) {
        return decimals === 0 ? '0' : '0,00';
    }

    // Handle negative numbers
    const isNegative = numAmount < 0;
    const absoluteAmount = Math.abs(numAmount);

    const parts = absoluteAmount.toFixed(decimals).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimalPart = parts[1];

    const formatted = decimals === 0 ? integerPart : `${integerPart},${decimalPart}`;
    return isNegative ? `-${formatted}` : formatted;
}

export function formatCurrencyCompact(amount: number): string {
    const numAmount = Number(amount);

    // Handle NaN or invalid numbers
    if (isNaN(numAmount)) {
        return '0';
    }

    // Handle negative numbers
    const isNegative = numAmount < 0;
    const absoluteAmount = Math.abs(numAmount);

    // Si es mayor o igual a 1 millón, formato compacto
    if (absoluteAmount >= 1000000) {
        const millions = absoluteAmount / 1000000;
        // Si es número entero, no mostrar decimales
        const formatted = millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1).replace('.', ',')}M`;
        return isNegative ? `-${formatted}` : formatted;
    }

    // Si es menor a 1 millón, formato normal sin decimales
    return formatCurrency(absoluteAmount, 0);
}
