'use client';

export function OverviewTab() {
    return (
        <div className='space-y-4 sm:space-y-6'>
            <div className='grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4'>
                <div className='rounded-lg border bg-card p-4 sm:p-5 md:p-6 shadow-sm'>
                    <h3 className='text-xs sm:text-sm font-medium text-muted-foreground'>Total Balance</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='text-xl sm:text-2xl md:text-3xl font-bold'>$12,345.67</p>
                        <p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>+20.1% from last month</p>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 sm:p-5 md:p-6 shadow-sm'>
                    <h3 className='text-xs sm:text-sm font-medium text-muted-foreground'>Income</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='text-xl sm:text-2xl md:text-3xl font-bold'>$8,234.50</p>
                        <p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>+15.3% from last month</p>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 sm:p-5 md:p-6 shadow-sm'>
                    <h3 className='text-xs sm:text-sm font-medium text-muted-foreground'>Expenses</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='text-xl sm:text-2xl md:text-3xl font-bold'>$4,111.17</p>
                        <p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>+7.2% from last month</p>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 sm:p-5 md:p-6 shadow-sm'>
                    <h3 className='text-xs sm:text-sm font-medium text-muted-foreground'>Savings</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='text-xl sm:text-2xl md:text-3xl font-bold'>$4,123.33</p>
                        <p className='text-[10px] sm:text-xs text-muted-foreground mt-1'>+33.4% from last month</p>
                    </div>
                </div>
            </div>

            <div className='grid gap-3 sm:gap-4 md:grid-cols-2'>
                <div className='rounded-lg border bg-card p-4 sm:p-5 md:p-6 shadow-sm'>
                    <h3 className='text-sm sm:text-base font-semibold mb-3 sm:mb-4'>Recent Activity</h3>
                    <div className='space-y-3 sm:space-y-4'>
                        <div className='flex items-center justify-between gap-3'>
                            <div className='min-w-0 flex-1'>
                                <p className='text-xs sm:text-sm font-medium truncate'>Coffee Shop</p>
                                <p className='text-[10px] sm:text-xs text-muted-foreground'>Today, 9:30 AM</p>
                            </div>
                            <p className='text-xs sm:text-sm font-semibold whitespace-nowrap'>-$4.50</p>
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                            <div className='min-w-0 flex-1'>
                                <p className='text-xs sm:text-sm font-medium truncate'>Salary Deposit</p>
                                <p className='text-[10px] sm:text-xs text-muted-foreground'>Yesterday</p>
                            </div>
                            <p className='text-xs sm:text-sm font-semibold text-green-600 whitespace-nowrap'>
                                +$3,500.00
                            </p>
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                            <div className='min-w-0 flex-1'>
                                <p className='text-xs sm:text-sm font-medium truncate'>Grocery Store</p>
                                <p className='text-[10px] sm:text-xs text-muted-foreground'>2 days ago</p>
                            </div>
                            <p className='text-xs sm:text-sm font-semibold whitespace-nowrap'>-$87.32</p>
                        </div>
                    </div>
                </div>

                <div className='rounded-lg border bg-card p-4 sm:p-5 md:p-6 shadow-sm'>
                    <h3 className='text-sm sm:text-base font-semibold mb-3 sm:mb-4'>Budget Overview</h3>
                    <div className='space-y-3 sm:space-y-4'>
                        <div>
                            <div className='flex items-center justify-between mb-2 gap-2'>
                                <p className='text-xs sm:text-sm font-medium'>Food & Dining</p>
                                <p className='text-xs sm:text-sm text-muted-foreground whitespace-nowrap'>
                                    $420 / $500
                                </p>
                            </div>
                            <div className='w-full bg-muted rounded-full h-2'>
                                <div
                                    className='bg-primary h-2 rounded-full transition-all duration-500'
                                    style={{ width: '84%' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-between mb-2 gap-2'>
                                <p className='text-xs sm:text-sm font-medium'>Transportation</p>
                                <p className='text-xs sm:text-sm text-muted-foreground whitespace-nowrap'>
                                    $150 / $300
                                </p>
                            </div>
                            <div className='w-full bg-muted rounded-full h-2'>
                                <div
                                    className='bg-primary h-2 rounded-full transition-all duration-500'
                                    style={{ width: '50%' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-between mb-2 gap-2'>
                                <p className='text-xs sm:text-sm font-medium'>Entertainment</p>
                                <p className='text-xs sm:text-sm text-muted-foreground whitespace-nowrap'>$95 / $200</p>
                            </div>
                            <div className='w-full bg-muted rounded-full h-2'>
                                <div
                                    className='bg-primary h-2 rounded-full transition-all duration-500'
                                    style={{ width: '47.5%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
