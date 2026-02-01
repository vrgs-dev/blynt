import Link from 'next/link';
import { LogoAnimated } from '@/components/logo';
import { HeartIcon, XIcon } from '@/components/icons';

export function Footer() {
    return (
        <footer className='bg-muted/30 px-4 sm:px-6 py-8 sm:py-12 border-t'>
            <div className='mx-auto max-w-6xl'>
                <div className='flex justify-between items-center gap-6 sm:gap-8'>
                    <div className='flex flex-col flex-1 items-start gap-2'>
                        <LogoAnimated size='md' />

                        <p className='text-muted-foreground/70 text-xs'>
                            &copy; {new Date().getFullYear()} Blynt. All rights reserved.
                        </p>
                    </div>

                    <p className='flex items-center self-end gap-1.5 text-muted-foreground text-sm'>
                        Made with <HeartIcon className='size-4 text-accent' /> by{' '}
                        <Link
                            href='https://x.com/vrgs_0'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors'
                        >
                            <XIcon className='size-3.5' />
                            Camilo Vargas
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
