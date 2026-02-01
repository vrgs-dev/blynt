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
        <div className='inline-block relative'>
            <svg width={size} height={size} className={cn('z-10 relative', className)} viewBox='0 0 48 48' fill='none'>
                <g clipPath='url(#clip0_16_2)'>
                    {/* Background with original green */}
                    <rect x='0' y='0' width='48' height='48' rx='12' fill='#00C59E' />
                    <rect
                        x='0'
                        y='0'
                        width='48'
                        height='48'
                        rx='12'
                        stroke='hsl(var(--foreground))'
                        strokeWidth='2'
                        strokeOpacity='0.15'
                        fill='none'
                    />
                    {/* B letter - bold brutalist style */}
                    <path d='M15 13V39' stroke='white' strokeWidth='5.5' strokeLinecap='round' />
                    <path
                        d='M15 12H25.5C28.8137 12 31.5 14.6863 31.5 18C31.5 21.3137 28.8137 24 25.5 24H15'
                        stroke='white'
                        strokeWidth='5.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                    <path
                        d='M15 24H27C31.1421 24 34.5 27.3579 34.5 31.5C34.5 35.6421 31.1421 39 27 39H15'
                        stroke='white'
                        strokeWidth='5.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </g>
                <defs>
                    <clipPath id='clip0_16_2'>
                        <rect width='48' height='48' rx='12' fill='white' />
                    </clipPath>
                </defs>
            </svg>
            <div
                className='top-0 left-0 -z-10 absolute bg-foreground/10 rounded-md'
                style={{
                    width: size,
                    height: size,
                    transform: 'translate(3px, 3px)',
                }}
            />
        </div>
    );
}

// Animated version with hover effects - Soft Brutalism style
export function LogoAnimated({ className, size = 'md', showText = true }: LogoProps) {
    const { icon, text, gap } = sizes[size];

    return (
        <div className={cn('group flex items-center', gap, className)}>
            <div className='-translate-x-px -translate-y-px'>
                <LogoIcon size={icon} />
            </div>
            {showText && (
                <span className={cn('font-black tracking-tight transition-colors', 'group-hover:text-primary', text)}>
                    Blynt
                </span>
            )}
        </div>
    );
}
