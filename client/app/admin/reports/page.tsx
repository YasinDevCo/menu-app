'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, ShoppingBag, Wallet, Clock } from 'lucide-react'
import { useSalesStats, useDashboardStats } from '@/lib/hooks/useStats'
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

const periods = [
    { value: 'day', label: 'امروز' },
    { value: 'week', label: 'این هفته' },
    { value: 'month', label: 'این ماه' },
    { value: 'year', label: 'امسال' },
]

export default function AdminReportsPage() {
    const [period, setPeriod] = useState('day')
    const { data: salesStats, isLoading: salesLoading } = useSalesStats(period)
    const { data: dashboardStats, isLoading: dashboardLoading } = useDashboardStats()

    if (salesLoading || dashboardLoading) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-6xl mx-auto space-y-4">
                    <Skeleton className="h-10 w-32" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
                    </div>
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        )
    }

    // مقادیر پیش‌فرض برای جلوگیری از undefined
    const todayRevenue = dashboardStats?.todayRevenue || 0
    const todayOrders = dashboardStats?.todayOrders || 0
    const pendingOrders = dashboardStats?.pendingOrders || 0
    const revenueChange = dashboardStats?.revenueChange ?? 0
    const averageOrderValue = salesStats?.summary?.averageOrderValue || 0
    const totalOrders = salesStats?.summary?.totalOrders || 0
    const totalRevenue = salesStats?.summary?.totalRevenue || 0
    const topProducts = salesStats?.topProducts || []
    const chartData = salesStats?.chartData || []

    return (
        <main className="min-h-screen bg-background" dir="rtl">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-50">
                <div className="flex items-center h-14 px-4 max-w-6xl mx-auto">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/dashboard">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="font-bold text-foreground mr-2">گزارشات فروش</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-4 max-w-6xl mx-auto space-y-6">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">فروش امروز</p>
                                    <p className="text-2xl font-bold">{formatPrice(todayRevenue)}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Wallet className="h-5 w-5 text-green-500" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs">
                                <TrendingUp className={`h-3 w-3 ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                                <span className={revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                                    {revenueChange}%
                                </span>
                                <span className="text-muted-foreground">نسبت به دیروز</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">تعداد سفارشات امروز</p>
                                    <p className="text-2xl font-bold">{toPersianNumber(todayOrders)}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">سفارشات در انتظار</p>
                                    <p className="text-2xl font-bold">{toPersianNumber(pendingOrders)}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">میانگین ارزش سفارش</p>
                                    <p className="text-2xl font-bold">{formatPrice(averageOrderValue)}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Summary */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>خلاصه فروش</CardTitle>
                            <Tabs value={period} onValueChange={setPeriod} className="w-auto">
                                <TabsList>
                                    {periods.map(p => (
                                        <TabsTrigger key={p.value} value={p.value}>{p.label}</TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">تعداد سفارشات</p>
                                <p className="text-3xl font-bold">{toPersianNumber(totalOrders)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">کل فروش</p>
                                <p className="text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">میانگین ارزش سفارش</p>
                                <p className="text-3xl font-bold">{formatPrice(averageOrderValue)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>پرفروش‌ترین محصولات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topProducts.length > 0 ? (
                                topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                                {toPersianNumber(index + 1)}
                                            </div>
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                        <div className="flex gap-4 text-sm">
                                            <span className="text-muted-foreground">
                                                {toPersianNumber(product.quantity)} عدد
                                            </span>
                                            <span className="font-bold text-primary">
                                                {formatPrice(product.revenue)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-8">هیچ فروشی در این بازه ثبت نشده است</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Chart Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>نمودار فروش روزانه</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {chartData.length > 0 ? (
                                chartData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-24 text-sm text-muted-foreground">{item.date}</div>
                                        <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full flex items-center justify-end px-2 text-xs text-white"
                                                style={{ width: `${Math.min(100, (item.revenue / (totalRevenue || 1)) * 100)}%` }}
                                            >
                                                {formatPrice(item.revenue)}
                                            </div>
                                        </div>
                                        <div className="w-16 text-sm text-center">{toPersianNumber(item.count)} سفارش</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-8">هیچ داده‌ای برای نمایش وجود ندارد</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}