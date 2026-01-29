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
import { UserMenu } from './types';

const userMenu: UserMenu = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: '',
    initials: 'JD',
};

export function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className='size-10 rounded-lg cursor-pointer'>
                    <AvatarFallback className='rounded-lg bg-primary/10 text-primary text-xs font-semibold'>
                        {userMenu.initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side='top'
                align='end'
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            >
                <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-sm'>
                        <Avatar className='size-8 rounded-lg'>
                            <AvatarFallback className='rounded-lg bg-primary/10 text-primary'>
                                {userMenu.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className='grid flex-1 leading-tight'>
                            <span className='truncate font-semibold'>{userMenu.name}</span>
                            <span className='truncate text-xs text-muted-foreground'>{userMenu.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='/profile'>
                        <User className='size-4 mr-2 hover:text-white' />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/settings'>
                        <Settings className='size-4 mr-2 hover:text-white' />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-destructive hover:text-white'>
                    <LogOut className='size-4 mr-2 hover:text-white' />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
