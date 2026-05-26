'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, AlertCircle, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentResultPage() {
    const searchParams = useSearchParams()
    const status = searchParams.get('status')
    const refId = searchParams.get('refId')

    const isSuccess = status === 'success'
    const isAlreadyPaid = status === 'already_paid'
    const isFailed = status === 'failed'

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <Card className="max-w-md w-full shadow-xl text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {isSuccess ? (
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                        ) : isAlreadyPaid ? (
                            <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                                <AlertCircle className="h-10 w-10 text-yellow-500" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-red-500" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {isSuccess ? 'پرداخت موفق' : isAlreadyPaid ? 'پرداخت قبلاً انجام شده' : 'پرداخت ناموفق'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isSuccess && refId && (
                        <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">شماره پیگیری</p>
                            <p className="text-lg font-mono font-bold text-primary">{refId}</p>
                        </div>
                    )}

                    <p className="text-muted-foreground">
                        {isSuccess
                            ? 'سفارش شما با موفقیت ثبت شد و به زودی آماده می‌شود'
                            : isAlreadyPaid
                                ? 'این سفارش قبلاً پرداخت شده است'
                                : 'متأسفانه پرداخت با مشکل مواجه شد. لطفاً مجدداً تلاش کنید'
                        }
                    </p>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full gap-2">
                            <Link href="/menu">
                                <ShoppingBag className="h-4 w-4" />
                                بازگشت به منو
                            </Link>
                        </Button>
                        {!isSuccess && !isAlreadyPaid && (
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/cart">بازگشت به سبد خرید</Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}