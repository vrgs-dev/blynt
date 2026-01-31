'use client';

import { InputParse } from './input-parse';

export function OverviewTab() {
    const handleAddExpense = (expense: {
        amount: number;
        category: string;
        merchant: string;
        date: string;
        isIncome: boolean;
        note?: string;
    }) => {
        // TODO: Integrate with your API/state management
        console.log('New expense added:', expense);
    };

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Natural Language Input */}
            <div className='gap-3 sm:gap-4 grid grid-cols-2 lg:grid-cols-4'>
                <div className='bg-card shadow-sm p-4 sm:p-5 md:p-6 border rounded-lg'>
                    <h3 className='font-medium text-muted-foreground text-xs sm:text-sm'>Total Balance</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='font-bold text-xl sm:text-2xl md:text-3xl'>$12,345.67</p>
                        <p className='mt-1 text-[10px] text-muted-foreground sm:text-xs'>+20.1% from last month</p>
                    </div>
                </div>

                <div className='bg-card shadow-sm p-4 sm:p-5 md:p-6 border rounded-lg'>
                    <h3 className='font-medium text-muted-foreground text-xs sm:text-sm'>Income</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='font-bold text-xl sm:text-2xl md:text-3xl'>$8,234.50</p>
                        <p className='mt-1 text-[10px] text-muted-foreground sm:text-xs'>+15.3% from last month</p>
                    </div>
                </div>

                <div className='bg-card shadow-sm p-4 sm:p-5 md:p-6 border rounded-lg'>
                    <h3 className='font-medium text-muted-foreground text-xs sm:text-sm'>Expenses</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='font-bold text-xl sm:text-2xl md:text-3xl'>$4,111.17</p>
                        <p className='mt-1 text-[10px] text-muted-foreground sm:text-xs'>+7.2% from last month</p>
                    </div>
                </div>

                <div className='bg-card shadow-sm p-4 sm:p-5 md:p-6 border rounded-lg'>
                    <h3 className='font-medium text-muted-foreground text-xs sm:text-sm'>Savings</h3>
                    <div className='mt-2 sm:mt-3'>
                        <p className='font-bold text-xl sm:text-2xl md:text-3xl'>$4,123.33</p>
                        <p className='mt-1 text-[10px] text-muted-foreground sm:text-xs'>+33.4% from last month</p>
                    </div>
                </div>
            </div>
            <InputParse onAdd={handleAddExpense} />

            <div className='gap-3 sm:gap-4 grid md:grid-cols-2'>
                <div className='bg-card shadow-sm p-4 sm:p-5 md:p-6 border rounded-lg'>
                    <h3 className='mb-3 sm:mb-4 font-semibold text-sm sm:text-base'>Recent Activity</h3>
                    <div className='space-y-3 sm:space-y-4'>
                        <div className='flex justify-between items-center gap-3'>
                            <div className='flex-1 min-w-0'>
                                <p className='font-medium text-xs sm:text-sm truncate'>Coffee Shop</p>
                                <p className='text-[10px] text-muted-foreground sm:text-xs'>Today, 9:30 AM</p>
                            </div>
                            <p className='font-semibold text-xs sm:text-sm whitespace-nowrap'>-$4.50</p>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <div className='flex-1 min-w-0'>
                                <p className='font-medium text-xs sm:text-sm truncate'>Salary Deposit</p>
                                <p className='text-[10px] text-muted-foreground sm:text-xs'>Yesterday</p>
                            </div>
                            <p className='font-semibold text-green-600 text-xs sm:text-sm whitespace-nowrap'>
                                +$3,500.00
                            </p>
                        </div>
                        <div className='flex justify-between items-center gap-3'>
                            <div className='flex-1 min-w-0'>
                                <p className='font-medium text-xs sm:text-sm truncate'>Grocery Store</p>
                                <p className='text-[10px] text-muted-foreground sm:text-xs'>2 days ago</p>
                            </div>
                            <p className='font-semibold text-xs sm:text-sm whitespace-nowrap'>-$87.32</p>
                        </div>
                    </div>
                </div>

                <div className='bg-card shadow-sm p-4 sm:p-5 md:p-6 border rounded-lg'>
                    <h3 className='mb-3 sm:mb-4 font-semibold text-sm sm:text-base'>Budget Overview</h3>
                    <div className='space-y-3 sm:space-y-4'>
                        <div>
                            <div className='flex justify-between items-center gap-2 mb-2'>
                                <p className='font-medium text-xs sm:text-sm'>Food & Dining</p>
                                <p className='text-muted-foreground text-xs sm:text-sm whitespace-nowrap'>
                                    $420 / $500
                                </p>
                            </div>
                            <div className='bg-muted rounded-full w-full h-2'>
                                <div
                                    className='bg-primary rounded-full h-2 transition-all duration-500'
                                    style={{ width: '84%' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='flex justify-between items-center gap-2 mb-2'>
                                <p className='font-medium text-xs sm:text-sm'>Transportation</p>
                                <p className='text-muted-foreground text-xs sm:text-sm whitespace-nowrap'>
                                    $150 / $300
                                </p>
                            </div>
                            <div className='bg-muted rounded-full w-full h-2'>
                                <div
                                    className='bg-primary rounded-full h-2 transition-all duration-500'
                                    style={{ width: '50%' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='flex justify-between items-center gap-2 mb-2'>
                                <p className='font-medium text-xs sm:text-sm'>Entertainment</p>
                                <p className='text-muted-foreground text-xs sm:text-sm whitespace-nowrap'>$95 / $200</p>
                            </div>
                            <div className='bg-muted rounded-full w-full h-2'>
                                <div
                                    className='bg-primary rounded-full h-2 transition-all duration-500'
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
