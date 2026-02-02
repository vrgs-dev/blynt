'use client';

import EnableAccountDialog from '@/components/enable-account-dialog';
import Header from './_components/header/header';
import { useCheckDisableAccount } from '@/lib/api/hooks/use-settings';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { data: disableAccountData } = useCheckDisableAccount();

    if (disableAccountData?.success) {
        return <EnableAccountDialog open={true} onOpenChange={() => {}} />;
    }

    return (
        <main className='grid grid-rows-[auto_1fr] bg-background mx-auto max-w-7xl h-dvh'>
            <Header />
            {children}
        </main>
    );
}
