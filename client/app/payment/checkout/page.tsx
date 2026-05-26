'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { formatPrice } from '@/lib/utils/format'
import { Loader2, CreditCard, ShieldCheck } from 'lucide-react'

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const authority = searchParams.get('authority')
  const orderId = searchParams.get('orderId')
  
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [amount, setAmount] = useState(0)
  const [orderInfo, setOrderInfo] = useState<any>(null)

  useEffect(() => {
    if (!authority || !orderId) {
      toast.error('اطلاعات پرداخت کامل نیست')
      router.push('/')
      return
    }

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`)
        setAmount(data.data.totalAmount)
        setOrderInfo(data.data)
      } catch (error) {
        console.error('Error fetching order:', error)
        toast.error('خطا در دریافت اطلاعات سفارش')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [authority, orderId, router])

  const handlePay = async () => {
    setProcessing(true)
    // هدایت به صفحه تأیید پرداخت
    window.location.href = `http://localhost:5000/api/payment/verify?authority=${authority}&orderId=${orderId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <Card className="max-w-md w-full shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">پرداخت آنلاین</CardTitle>
          <p className="text-muted-foreground text-sm mt-2">
            لطفاً اطلاعات پرداخت را بررسی کنید
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* اطلاعات سفارش */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">شماره سفارش:</span>
              <span className="font-mono">{orderId?.slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">شماره پیگیری:</span>
              <span className="font-mono text-xs">{authority}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">میز:</span>
              <span>{orderInfo?.tableNumber}</span>
            </div>
          </div>
          
          {/* مبلغ */}
          <div className="text-center">
            <p className="text-muted-foreground mb-2">مبلغ قابل پرداخت</p>
            <p className="text-4xl font-bold text-primary">
              {formatPrice(amount)}
            </p>
          </div>

          {/* دکمه پرداخت */}
          <Button 
            onClick={handlePay} 
            disabled={processing}
            className="w-full h-12 text-base gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال اتصال به درگاه...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                پرداخت
              </>
            )}
          </Button>

          {/* امنیت */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            <span>پرداخت شما توسط درگاه امن انجام می‌شود</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}