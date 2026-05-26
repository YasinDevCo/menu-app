'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, CheckCircle, Clock, XCircle, Bell, CreditCard } from 'lucide-react'
import { useOrders, useUpdateOrderStatus } from '@/lib/hooks/useOrders'
import { useAuthStore } from '@/lib/store/auth-store'
import { getSocket } from '@/lib/socket'
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import api from '@/lib/api/client'

const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'در انتظار', color: 'bg-yellow-500' },
    CONFIRMED: { label: 'تأیید شده', color: 'bg-blue-500' },
    PREPARING: { label: 'در حال آماده‌سازی', color: 'bg-orange-500' },
    READY: { label: 'آماده تحویل', color: 'bg-green-500' },
    DELIVERED: { label: 'تحویل شده', color: 'bg-gray-500' },
    CANCELED: { label: 'لغو شده', color: 'bg-red-500' },
    COMPLETED: { label: 'کامل شده', color: 'bg-green-700' },
}

export default function AdminOrdersPage() {
    const [selectedTab, setSelectedTab] = useState('all')
    const { business } = useAuthStore()
    const { data: orders = [], isLoading, refetch } = useOrders(selectedTab !== 'all' ? selectedTab : undefined)
    const updateStatus = useUpdateOrderStatus()
    const [newOrderAlert, setNewOrderAlert] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(false)
    const soundEnabledRef = useRef(false)

    // فعال کردن صدا با اولین کلیک کاربر
    useEffect(() => {
        const enableSound = () => {
            if (!soundEnabledRef.current) {
                soundEnabledRef.current = true
                setSoundEnabled(true)
                const testAudio = new Audio('/sounds/notification.mp3')
                testAudio.volume = 0.1
                testAudio.play().catch(e => console.log('Test sound:', e))
            }
        }

        document.addEventListener('click', enableSound)
        document.addEventListener('touchstart', enableSound)

        return () => {
            document.removeEventListener('click', enableSound)
            document.removeEventListener('touchstart', enableSound)
        }
    }, [])

    // اتصال به WebSocket
    useEffect(() => {
        if (!business?.id) return

        const socket = getSocket(business.id)

        socket.on('order-notification', (data) => {
            console.log('📢 سفارش جدید دریافت شد:', data)

            if (soundEnabledRef.current) {
                const audio = new Audio('/sounds/notification.mp3')
                audio.volume = 0.7
                audio.play().catch(e => console.log('صدا پخش نشد:', e))
            }

            toast.success(`سفارش جدید از میز ${data.tableNumber}`, {
                duration: 5000,
                icon: <Bell className="h-4 w-4" />
            })

            refetch()
            setNewOrderAlert(true)
            setTimeout(() => setNewOrderAlert(false), 3000)
        })

        socket.on('status-updated', (data) => {
            console.log('🔄 وضعیت سفارش تغییر کرد:', data)
            refetch()
            toast.info(`سفارش ${data.orderId.slice(-6)}: ${data.status}`)
        })

        return () => {
            socket.off('order-notification')
            socket.off('status-updated')
        }
    }, [business?.id, refetch])

    const handleStatusChange = (orderId: string, newStatus: string) => {
        updateStatus.mutate({ id: orderId, status: newStatus as any })
    }

    // دکمه پرداخت آنلاین
    const handlePayment = async (orderId: string) => {
        try {
            const { data } = await api.post('/payment/request', { orderId })
            if (data.success && data.data.paymentUrl) {
                window.open(data.data.paymentUrl, '_blank')
                toast.success('درگاه پرداخت باز شد')
            } else {
                toast.error('خطا در ایجاد درگاه پرداخت')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'خطا در ایجاد درگاه پرداخت')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-6">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-20" />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background" dir="rtl">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-50">
                <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/dashboard">
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="font-bold text-foreground mr-2">مدیریت سفارشات</h1>
                        {!soundEnabled && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                برای فعال شدن صدا کلیک کنید
                            </span>
                        )}
                    </div>
                    {newOrderAlert && (
                        <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                            <Bell className="h-4 w-4" />
                            <span className="text-xs">سفارش جدید</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Content */}
            <div className="p-4 max-w-4xl mx-auto">
                <Tabs defaultValue="all" onValueChange={setSelectedTab} className="space-y-4">
                    <TabsList className="grid grid-cols-5 w-full max-w-md mx-auto">
                        <TabsTrigger value="all">همه</TabsTrigger>
                        <TabsTrigger value="PENDING" className="relative">
                            در انتظار
                            {orders.filter(o => o.status === 'PENDING').length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                    {orders.filter(o => o.status === 'PENDING').length}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="CONFIRMED">تأیید شده</TabsTrigger>
                        <TabsTrigger value="PREPARING">در حال آماده‌سازی</TabsTrigger>
                        <TabsTrigger value="READY">آماده</TabsTrigger>
                    </TabsList>

                    <TabsContent value={selectedTab} className="space-y-3">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">هیچ سفارشی یافت نشد</p>
                            </div>
                        ) : (
                            orders.map((order: any) => (
                                <Card key={order._id} className="p-4 space-y-3 transition-all hover:shadow-md">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-foreground">
                                                سفارش #{order._id.slice(-6)}
                                            </span>
                                            <Badge className={statusMap[order.status]?.color}>
                                                {statusMap[order.status]?.label || order.status}
                                            </Badge>
                                            {order.payment?.method === 'ONLINE' && order.payment?.status === 'PAID' && (
                                                <Badge variant="outline" className="border-green-500 text-green-600">
                                                    پرداخت شده
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            میز: {toPersianNumber(order.tableNumber)}
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-3">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm py-1">
                                                <span>
                                                    {toPersianNumber(item.quantity)} × {item.name}
                                                </span>
                                                <span className="font-medium">{formatPrice(item.itemTotal)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-border pt-3 flex items-center justify-between flex-wrap gap-2">
                                        <div className="font-bold text-primary">
                                            {formatPrice(order.totalAmount)}
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            {/* پرداخت آنلاین */}
                                            {order.status === 'PENDING' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePayment(order._id)}
                                                    className="border-green-500 text-green-600 hover:bg-green-50"
                                                >
                                                    <CreditCard className="h-4 w-4 ml-1" />
                                                    پرداخت آنلاین
                                                </Button>
                                            )}

                                            {/* دکمه‌های تغییر وضعیت */}
                                            {order.status === 'PENDING' && order.payment?.status === 'PAID' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(order._id, 'CONFIRMED')}
                                                    disabled={updateStatus.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 ml-1" />
                                                    تأیید
                                                </Button>
                                            )}

                                            {order.status === 'CONFIRMED' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(order._id, 'PREPARING')}
                                                    disabled={updateStatus.isPending}
                                                >
                                                    <Clock className="h-4 w-4 ml-1" />
                                                    شروع آماده‌سازی
                                                </Button>
                                            )}

                                            {order.status === 'PREPARING' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(order._id, 'READY')}
                                                    disabled={updateStatus.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 ml-1" />
                                                    آماده تحویل
                                                </Button>
                                            )}

                                            {order.status === 'READY' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(order._id, 'DELIVERED')}
                                                    disabled={updateStatus.isPending}
                                                >
                                                    <CheckCircle className="h-4 w-4 ml-1" />
                                                    تحویل شد
                                                </Button>
                                            )}

                                            {order.status === 'PENDING' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-destructive border-destructive"
                                                    onClick={() => handleStatusChange(order._id, 'CANCELED')}
                                                    disabled={updateStatus.isPending}
                                                >
                                                    <XCircle className="h-4 w-4 ml-1" />
                                                    لغو
                                                </Button>
                                            )}

                                            <Button size="sm" variant="ghost" asChild>
                                                <Link href={`/admin/orders/${order._id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}