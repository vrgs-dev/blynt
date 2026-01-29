import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showText?: boolean;
}

const sizes = {
    sm: { icon: 24, text: 'text-base', gap: 'gap-1.5' },
    md: { icon: 32, text: 'text-xl', gap: 'gap-2' },
    lg: { icon: 40, text: 'text-2xl', gap: 'gap-2.5' },
    xl: { icon: 56, text: 'text-3xl', gap: 'gap-3' },
};

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
    const { icon, text, gap } = sizes[size];

    return (
        <div className={cn('flex items-center', gap, className)}>
            <LogoIcon size={icon} />
            {showText && <span className={cn('font-bold tracking-tight', text)}>Blynt</span>}
        </div>
    );
}

interface LogoIconProps {
    size?: number;
    className?: string;
}

export function LogoIcon({ size = 32, className }: LogoIconProps) {
    return (
        <svg width={size} height={size} className={className} viewBox='0 0 48 48' fill='none'>
            <g clipPath='url(#clip0_16_2)'>
                <path
                    d='M36 0H12C5.37258 0 0 5.37258 0 12V36C0 42.6274 5.37258 48 12 48H36C42.6274 48 48 42.6274 48 36V12C48 5.37258 42.6274 0 36 0Z'
                    fill='#00C59E'
                />
                <path d='M15 13V39' stroke='white' strokeWidth='5' strokeLinecap='round' />
                <path
                    d='M15 12H25.5C28.8137 12 31.5 14.6863 31.5 18C31.5 21.3137 28.8137 24 25.5 24H15'
                    stroke='white'
                    strokeWidth='5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
                <path
                    d='M15 24H27C31.1421 24 34.5 27.3579 34.5 31.5C34.5 35.6421 31.1421 39 27 39H15'
                    stroke='white'
                    strokeWidth='5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </g>
            <defs>
                <clipPath id='clip0_16_2'>
                    <rect width='48' height='48' fill='white' />
                </clipPath>
            </defs>
        </svg>
    );
}

// Animated version with hover glow
export function LogoAnimated({ className, size = 'md', showText = true }: LogoProps) {
    const { icon, text, gap } = sizes[size];

    return (
        <div className={cn('flex items-center group', gap, className)}>
            <div className='relative'>
                <LogoIcon size={icon} />
                <div className='absolute inset-0 rounded-lg bg-primary/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10' />
            </div>
            {showText && <span className={cn('font-bold tracking-tight', text)}>Blynt</span>}
        </div>
    );
}
