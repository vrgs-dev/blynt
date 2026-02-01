'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className='flex flex-col items-center gap-2'>
            <p className='mt-8 font-semibold text-muted-foreground/60 text-xs text-center uppercase tracking-widest'>
                Track your expenses with ease
            </p>
            <Link href='/'>
                <Button variant='link'>
                    <ArrowLeft className='size-4' />
                    Back to home
                </Button>
            </Link>
        </footer>
    );
}
