'use client';

import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, User } from 'lucide-react';
import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export function UserMenu() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    if (isPending) {
        return (
            <div className='w-9 sm:w-10 h-9 sm:h-10'>
                <Skeleton className='rounded-xl w-full h-full' />
            </div>
        );
    }

    const initials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='group shrink-0'>
                    <Avatar className='bg-linear-to-br from-primary/20 to-primary/10 shadow-[2px_2px_0px_0px] shadow-foreground/5 group-hover:shadow-[3px_3px_0px_0px] group-hover:shadow-foreground/10 border-2 border-border rounded-xl size-9 sm:size-10 transition-all group-hover:-translate-x-px group-hover:-translate-y-px cursor-pointer'>
                        <AvatarFallback className='bg-transparent rounded-xl font-bold text-primary text-xs'>
                            {initials(session?.user?.name || '')}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side='bottom'
                align='end'
                className='shadow-[3px_3px_0px_0px] shadow-foreground/10 p-2 border-2 border-border rounded-xl w-64'
            >
                <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-3 bg-muted/50 p-2 rounded-lg'>
                        <Avatar className='bg-linear-to-br from-primary/20 to-primary/10 shadow-[2px_2px_0px_0px] shadow-foreground/5 group-hover:shadow-[3px_3px_0px_0px] group-hover:shadow-foreground/10 border-2 border-border rounded-xl size-9 sm:size-10 transition-all group-hover:-translate-x-px group-hover:-translate-y-px cursor-pointer'>
                            <AvatarFallback className='bg-transparent rounded-lg font-bold text-primary text-sm'>
                                {initials(session?.user?.name || '')}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                            <p className='font-bold text-foreground text-sm truncate'>{session?.user?.name}</p>
                            <p className='text-muted-foreground text-xs truncate'>{session?.user?.email}</p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='my-2' />
                <DropdownMenuItem asChild className='rounded-lg font-semibold'>
                    <Link href='/profile'>
                        <User className='size-4' />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className='rounded-lg font-semibold'>
                    <Link href='/settings'>
                        <Settings className='size-4' />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='my-2' />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className='focus:bg-destructive/10 rounded-lg font-semibold text-destructive focus:text-destructive'
                >
                    <LogOut className='size-4' />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
