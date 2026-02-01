import { ReactNode } from 'react';

export default async function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className='relative bg-background min-h-screen overflow-hidden'>
            {/* Decorative Grid Pattern */}
            <div className='fixed inset-0 pointer-events-none'>
                <div
                    className='absolute inset-0 opacity-[0.02]'
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* Decorative Shapes */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none'>
                {/* Top-left teal blob */}
                <div className='-top-32 -left-32 absolute bg-primary/8 blur-3xl rounded-full size-96' />

                {/* Bottom-right coral blob */}
                <div className='-right-48 -bottom-48 absolute bg-accent/6 blur-3xl rounded-full size-[500px]' />

                {/* Floating geometric shapes */}
                <div className='hidden lg:block top-20 right-[15%] absolute border-4 border-primary/10 rounded-2xl size-16 rotate-12' />
                <div className='hidden lg:block bottom-32 left-[10%] absolute bg-accent/10 rounded-xl size-12 -rotate-6' />
                <div className='hidden lg:block top-1/3 left-[8%] absolute bg-primary/15 rounded-lg size-8 rotate-45' />
                <div className='hidden lg:block right-[12%] bottom-1/4 absolute border-4 border-accent/10 rounded-full size-20' />
            </div>
            {children}
        </div>
    );
}
