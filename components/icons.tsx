export function ArrowRightIcon({ className = 'size-4' }: { className?: string }) {
    return (
        <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
        </svg>
    );
}

export function CheckIcon({ className = 'size-4 shrink-0 text-primary' }: { className?: string }) {
    return (
        <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
        </svg>
    );
}

export function ChatIcon({ className = 'size-6' }: { className?: string }) {
    return (
        <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
            />
        </svg>
    );
}

export function LightbulbIcon({ className = 'size-6' }: { className?: string }) {
    return (
        <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
            />
        </svg>
    );
}

export function CurrencyIcon({ className = 'size-6' }: { className?: string }) {
    return (
        <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
        </svg>
    );
}

export function LockIcon({ className = 'size-6' }: { className?: string }) {
    return (
        <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
            />
        </svg>
    );
}

export function XIcon({ className = 'size-5' }: { className?: string }) {
    return (
        <svg className={className} fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
    );
}

export function HeartIcon({ className = 'size-4' }: { className?: string }) {
    return (
        <svg className={className} fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
        </svg>
    );
}
