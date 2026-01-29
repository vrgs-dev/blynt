'use client';

export function TransactionsTab() {
    return (
        <div className='space-y-3 sm:space-y-4'>
            <div className='flex items-center justify-end'>
                <div className='flex items-center gap-2'>
                    <button className='inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 sm:h-9 px-2.5 sm:px-4'>
                        Filter
                    </button>
                    <button className='inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-8 sm:h-9 px-2.5 sm:px-4'>
                        <span className='hidden xs:inline'>Add Transaction</span>
                        <span className='xs:hidden'>Add</span>
                    </button>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className='md:hidden space-y-3'>
                <div className='rounded-lg border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors'>
                    <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium truncate'>Starbucks Coffee</p>
                            <p className='text-xs text-muted-foreground'>Downtown Location</p>
                        </div>
                        <p className='text-sm font-semibold text-red-600 dark:text-red-400 ml-2'>-$4.50</p>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Jan 28, 2026 • 9:30 AM</span>
                        <span className='inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'>
                            Food & Dining
                        </span>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors'>
                    <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium truncate'>Payroll Deposit</p>
                            <p className='text-xs text-muted-foreground'>Company Inc.</p>
                        </div>
                        <p className='text-sm font-semibold text-green-600 dark:text-green-400 ml-2'>+$3,500.00</p>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Jan 27, 2026 • 3:00 PM</span>
                        <span className='inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                            Income
                        </span>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors'>
                    <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium truncate'>Whole Foods Market</p>
                            <p className='text-xs text-muted-foreground'>Weekly Groceries</p>
                        </div>
                        <p className='text-sm font-semibold text-red-600 dark:text-red-400 ml-2'>-$87.32</p>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Jan 26, 2026 • 11:45 AM</span>
                        <span className='inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'>
                            Groceries
                        </span>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors'>
                    <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium truncate'>Netflix Subscription</p>
                            <p className='text-xs text-muted-foreground'>Monthly Payment</p>
                        </div>
                        <p className='text-sm font-semibold text-red-600 dark:text-red-400 ml-2'>-$15.99</p>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Jan 25, 2026 • 7:20 PM</span>
                        <span className='inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'>
                            Entertainment
                        </span>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors'>
                    <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium truncate'>Shell Gas Station</p>
                            <p className='text-xs text-muted-foreground'>Fuel Purchase</p>
                        </div>
                        <p className='text-sm font-semibold text-red-600 dark:text-red-400 ml-2'>-$45.00</p>
                    </div>
                    <div className='flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>Jan 24, 2026 • 2:15 PM</span>
                        <span className='inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'>
                            Transportation
                        </span>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className='hidden md:block rounded-lg border bg-card shadow-sm'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='border-b bg-muted/50'>
                            <tr>
                                <th className='h-10 sm:h-12 px-3 sm:px-4 text-left align-middle text-xs sm:text-sm font-medium text-muted-foreground'>
                                    Date
                                </th>
                                <th className='h-10 sm:h-12 px-3 sm:px-4 text-left align-middle text-xs sm:text-sm font-medium text-muted-foreground'>
                                    Description
                                </th>
                                <th className='h-10 sm:h-12 px-3 sm:px-4 text-left align-middle text-xs sm:text-sm font-medium text-muted-foreground'>
                                    Category
                                </th>
                                <th className='h-10 sm:h-12 px-3 sm:px-4 text-right align-middle text-xs sm:text-sm font-medium text-muted-foreground'>
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y'>
                            <tr className='hover:bg-muted/50 transition-colors'>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm whitespace-nowrap'>Jan 28, 2026</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>9:30 AM</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm font-medium'>Starbucks Coffee</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>Downtown Location</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <span className='inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 whitespace-nowrap'>
                                        Food & Dining
                                    </span>
                                </td>
                                <td className='p-3 sm:p-4 align-middle text-right'>
                                    <p className='text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 whitespace-nowrap'>
                                        -$4.50
                                    </p>
                                </td>
                            </tr>
                            <tr className='hover:bg-muted/50 transition-colors'>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm whitespace-nowrap'>Jan 27, 2026</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>3:00 PM</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm font-medium'>Payroll Deposit</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>Company Inc.</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <span className='inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 whitespace-nowrap'>
                                        Income
                                    </span>
                                </td>
                                <td className='p-3 sm:p-4 align-middle text-right'>
                                    <p className='text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 whitespace-nowrap'>
                                        +$3,500.00
                                    </p>
                                </td>
                            </tr>
                            <tr className='hover:bg-muted/50 transition-colors'>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm whitespace-nowrap'>Jan 26, 2026</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>11:45 AM</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm font-medium'>Whole Foods Market</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>Weekly Groceries</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <span className='inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap'>
                                        Groceries
                                    </span>
                                </td>
                                <td className='p-3 sm:p-4 align-middle text-right'>
                                    <p className='text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 whitespace-nowrap'>
                                        -$87.32
                                    </p>
                                </td>
                            </tr>
                            <tr className='hover:bg-muted/50 transition-colors'>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm whitespace-nowrap'>Jan 25, 2026</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>7:20 PM</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm font-medium'>Netflix Subscription</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>Monthly Payment</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <span className='inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 whitespace-nowrap'>
                                        Entertainment
                                    </span>
                                </td>
                                <td className='p-3 sm:p-4 align-middle text-right'>
                                    <p className='text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 whitespace-nowrap'>
                                        -$15.99
                                    </p>
                                </td>
                            </tr>
                            <tr className='hover:bg-muted/50 transition-colors'>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm whitespace-nowrap'>Jan 24, 2026</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>2:15 PM</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <p className='text-xs sm:text-sm font-medium'>Shell Gas Station</p>
                                    <p className='text-[10px] sm:text-xs text-muted-foreground'>Fuel Purchase</p>
                                </td>
                                <td className='p-3 sm:p-4 align-middle'>
                                    <span className='inline-flex items-center rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 whitespace-nowrap'>
                                        Transportation
                                    </span>
                                </td>
                                <td className='p-3 sm:p-4 align-middle text-right'>
                                    <p className='text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 whitespace-nowrap'>
                                        -$45.00
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
