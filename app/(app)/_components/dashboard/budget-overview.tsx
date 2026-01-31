'use client';

import { useMemo, useState } from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';
import type { BudgetItem } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChartIcon, TrendingUp, BarChart3 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface BudgetOverviewProps {
    budgets: BudgetItem[];
    title?: string;
    isLoading?: boolean;
}

// Color mapping for categories
const CATEGORY_CHART_COLORS = {
    'Food & Dining': 'hsl(25, 95%, 53%)',
    Food: 'hsl(25, 95%, 53%)',
    Transportation: 'hsl(217, 91%, 60%)',
    Transport: 'hsl(217, 91%, 60%)',
    Utilities: 'hsl(45, 93%, 47%)',
    Entertainment: 'hsl(271, 76%, 53%)',
    Healthcare: 'hsl(346, 77%, 50%)',
    Shopping: 'hsl(330, 81%, 60%)',
    Salary: 'hsl(142, 71%, 45%)',
    Other: 'hsl(215, 20%, 65%)',
};

export function BudgetOverview({ budgets, title = 'Expenses by Category', isLoading }: BudgetOverviewProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const { chartData, chartConfig, totalSpent } = useMemo(() => {
        const config: ChartConfig = {
            spent: {
                label: 'Spent',
            },
        };

        const data = budgets.map((budget, index) => {
            const categoryKey = budget.category.toLowerCase().replace(/[^a-z0-9]/g, '');
            const color =
                CATEGORY_CHART_COLORS[budget.category as keyof typeof CATEGORY_CHART_COLORS] ||
                `hsl(${(index * 360) / budgets.length}, 70%, 50%)`;

            config[categoryKey] = {
                label: budget.category,
                color: color,
            };

            return {
                category: categoryKey,
                categoryName: budget.category,
                spent: budget.spent,
                fill: `var(--color-${categoryKey})`,
            };
        });

        const total = budgets.reduce((sum, budget) => sum + budget.spent, 0);

        return { chartData: data, chartConfig: config, totalSpent: total };
    }, [budgets]);

    if (isLoading) {
        return (
            <div className='space-y-3'>
                <h3 className='px-1 font-bold text-foreground text-sm sm:text-base'>{title}</h3>
                <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 sm:p-6 border-2 border-border rounded-2xl overflow-hidden'>
                    <div className='flex flex-col items-center gap-6'>
                        <Skeleton className='rounded-full w-64 h-64' />
                        <div className='space-y-3 w-full'>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className='flex justify-between items-center'>
                                    <div className='flex items-center gap-2'>
                                        <Skeleton className='rounded-full w-3 h-3' />
                                        <Skeleton className='w-24 h-3' />
                                    </div>
                                    <Skeleton className='w-16 h-3' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (budgets.length === 0) {
        return (
            <div className='space-y-3'>
                <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 border-2 border-border border-dashed rounded-2xl overflow-hidden'>
                    <div className='flex flex-col items-center px-4 py-10 sm:py-14'>
                        {/* Icon Grid with Animation */}
                        <div className='relative mb-8'>
                            {/* Background Glow Effect */}
                            <div className='absolute inset-0 bg-primary/5 blur-2xl rounded-full animate-pulse' />

                            {/* Icon Container */}
                            <div className='relative flex items-center gap-2 sm:gap-3'>
                                <div className='group bg-linear-to-br from-orange-50 to-orange-100/50 shadow-[2px_2px_0px_0px] shadow-orange-200/40 hover:shadow-[3px_3px_0px_0px] hover:shadow-orange-200/60 p-2.5 sm:p-3 border-2 border-orange-200/60 rounded-xl'>
                                    <PieChartIcon className='w-4 sm:w-5 h-4 sm:h-5 text-orange-600 group-hover:rotate-12 transition-transform' />
                                </div>
                                <div className='group bg-linear-to-br from-blue-50 to-blue-100/50 shadow-[2px_2px_0px_0px] shadow-blue-200/40 hover:shadow-[3px_3px_0px_0px] hover:shadow-blue-200/60 p-2.5 sm:p-3 border-2 border-blue-200/60 rounded-xl'>
                                    <BarChart3 className='w-4 sm:w-5 h-4 sm:h-5 text-blue-600 group-hover:scale-110 transition-transform' />
                                </div>
                                <div className='group bg-linear-to-br from-emerald-50 to-emerald-100/50 shadow-[2px_2px_0px_0px] shadow-emerald-200/40 hover:shadow-[3px_3px_0px_0px] hover:shadow-emerald-200/60 p-2.5 sm:p-3 border-2 border-emerald-200/60 rounded-xl'>
                                    <TrendingUp className='w-4 sm:w-5 h-4 sm:h-5 text-emerald-600 group-hover:rotate-12 transition-transform' />
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <h4 className='mb-2 font-black text-foreground text-base sm:text-lg text-center tracking-tight'>
                            Ready to analyze
                        </h4>
                        <p className='mb-6 max-w-[280px] text-muted-foreground text-xs sm:text-sm text-center leading-relaxed'>
                            Once you start adding transactions, we&apos;ll build a personalized breakdown of your
                            spending, income trends, and patterns.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-3'>
            <h3 className='px-1 font-bold text-foreground text-sm sm:text-base'>{title}</h3>
            <div className='bg-card shadow-[3px_3px_0px_0px] shadow-foreground/5 p-4 sm:p-6 border-2 border-border rounded-2xl overflow-hidden'>
                {/* Chart and Legend Layout */}
                <div className='flex lg:flex-row flex-col items-center lg:items-start gap-6'>
                    {/* Chart */}
                    <div className='w-full lg:w-auto lg:shrink-0'>
                        <ChartContainer
                            config={chartConfig}
                            className='mx-auto w-[240px] lg:w-[280px] h-[240px] lg:h-[280px]'
                        >
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={chartData}
                                    dataKey='spent'
                                    nameKey='category'
                                    innerRadius={60}
                                    outerRadius={85}
                                    strokeWidth={3}
                                    activeIndex={activeIndex}
                                    activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                                        <Sector {...props} outerRadius={outerRadius + 8} />
                                    )}
                                    onMouseEnter={(_, index) => setActiveIndex(index)}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor='middle'
                                                        dominantBaseline='middle'
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className='fill-foreground font-black text-2xl lg:text-3xl'
                                                        >
                                                            $
                                                            {totalSpent.toLocaleString(undefined, {
                                                                maximumFractionDigits: 0,
                                                            })}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 20}
                                                            className='fill-muted-foreground font-semibold text-[10px] lg:text-xs uppercase tracking-wide'
                                                        >
                                                            Total Spent
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>

                    {/* Legend */}
                    <div className='flex-1 space-y-2 w-full'>
                        {chartData.map((item, index) => {
                            const percentage = totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
                            const isActive = activeIndex === index;

                            return (
                                <div
                                    key={item.category}
                                    className='flex justify-between items-center hover:bg-muted/30 p-2 rounded-lg transition-colors cursor-pointer'
                                    style={{
                                        backgroundColor: isActive ? 'hsl(var(--muted) / 0.5)' : 'transparent',
                                    }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    <div className='flex flex-1 items-center gap-2.5 min-w-0'>
                                        <div
                                            className='border-2 border-background rounded-full w-3 h-3 transition-transform duration-200 shrink-0'
                                            style={{
                                                backgroundColor: chartConfig[item.category]?.color,
                                                transform: isActive ? 'scale(1.2)' : 'scale(1)',
                                                boxShadow: isActive
                                                    ? `0 0 0 2px ${chartConfig[item.category]?.color}40`
                                                    : 'none',
                                            }}
                                        />
                                        <span className='font-semibold text-foreground text-xs sm:text-sm truncate'>
                                            {item.categoryName}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-3 shrink-0'>
                                        <span className='font-medium tabular-nums text-[10px] text-muted-foreground sm:text-xs'>
                                            {percentage.toFixed(1)}%
                                        </span>
                                        <span className='min-w-[60px] font-bold tabular-nums text-foreground text-xs sm:text-sm text-right'>
                                            $
                                            {item.spent.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BudgetOverview;
