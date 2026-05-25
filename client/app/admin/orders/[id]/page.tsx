'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useOrder } from '@/lib/hooks/useOrders'
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'در انتظار', color: 'bg-yellow-500' },
    CONFIRMED: { label: 'تأیید شده', color: 'bg-blue-500' },
    PREPARING: { label: 'در حال آماده‌سازی', color: 'bg-orange-500' },
    READY: { label: 'آماده تحویل', color: 'bg-green-500' },
    DELIVERED: { label: 'تحویل شده', color: 'bg-gray-500' },
    CANCELED: { label: 'لغو شده', color: 'bg-red-500' },
    COMPLETED: { label: 'کامل شده', color: 'bg-green-700' },
}

export default function AdminOrderDetailPage() {
    const { id } = useParams()
    const { data: order, isLoading } = useOrder(id as string)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">سفارش یافت نشد</p>
                    <Button asChild className="mt-4">
                        <Link href="/admin/orders">بازگشت به لیست سفارشات</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background" dir="rtl">
            <header className="border-b border-border bg-card sticky top-0 z-50">
                <div className="flex items-center h-14 px-4 max-w-2xl mx-auto">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/orders">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="font-bold text-foreground mr-2">جزئیات سفارش</h1>
                </div>
            </header>

            <div className="p-4 max-w-2xl mx-auto space-y-4">
                <Card className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">شماره سفارش</span>
                        <span className="font-mono text-sm">{order._id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">میز</span>
                        <span className="font-bold">{toPersianNumber(order.tableNumber)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">وضعیت</span>
                        <Badge className={statusMap[order.status]?.color}>
                            {statusMap[order.status]?.label || order.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">تاریخ</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                </Card>

                <Card className="p-4">
                    <h3 className="font-bold mb-3">آیتم‌های سفارش</h3>
                    <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        تعداد: {toPersianNumber(item.quantity)} × {formatPrice(item.priceAtTime)}
                                    </div>
                                </div>
                                <div className="font-bold">{formatPrice(item.itemTotal)}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">جمع کل</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">مالیات (۹%)</span>
                            <span>{formatPrice(order.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                            <span className="font-bold">قابل پرداخت</span>
                            <span className="font-bold text-primary text-lg">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </Card>

                {order.note && (
                    <Card className="p-4">
                        <h3 className="font-bold mb-2">یادداشت سفارش</h3>
                        <p className="text-muted-foreground text-sm">{order.note}</p>
                    </Card>
                )}

                {order.customer?.name && (
                    <Card className="p-4">
                        <h3 className="font-bold mb-2">اطلاعات مشتری</h3>
                        {order.customer.name && <p>نام: {order.customer.name}</p>}
                        {order.customer.phoneNumber && <p>تلفن: {order.customer.phoneNumber}</p>}
                    </Card>
                )}
            </div>
        </main>
    )
}