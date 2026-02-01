import Link from 'next/link';
import { LogoAnimated } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function Header() {
    return (
        <header className='top-0 z-50 sticky bg-background/80 backdrop-blur-sm border-b w-full'>
            <nav className='flex justify-between items-center mx-auto px-4 sm:px-6 max-w-6xl h-16'>
                <Link href='/' aria-label='Blynt Home'>
                    <LogoAnimated size='md' />
                </Link>
                <div className='flex items-center gap-2 sm:gap-4'>
                    <Link
                        href='#features'
                        className='hidden sm:block font-medium text-muted-foreground hover:text-foreground text-sm transition-colors'
                    >
                        Features
                    </Link>
                    <Link
                        href='#pricing'
                        className='hidden sm:block font-medium text-muted-foreground hover:text-foreground text-sm transition-colors'
                    >
                        Pricing
                    </Link>
                    <Button asChild size='sm'>
                        <Link href='/login'>Try Free</Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
}
