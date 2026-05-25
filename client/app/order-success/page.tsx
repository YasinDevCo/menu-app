'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          سفارش شما ثبت شد!
        </h1>
        <p className="text-muted-foreground mb-8">
          سفارش شما به آشپزخانه ارسال شد و به زودی آماده خواهد شد.
        </p>

        {/* Info Box */}
        <div className="w-full bg-muted/50 rounded-lg p-4 mb-8">
          <p className="text-sm text-muted-foreground">
            پرسنل رستوران سفارش شما را دریافت کردند. در صورت نیاز به کمک، با
            گارسون تماس بگیرید.
          </p>
        </div>

        {/* Action Button */}
        <Button asChild size="lg" className="w-full">
          <Link href="/menu">بازگشت به منو</Link>
        </Button>
      </div>
    </main>
  )
}
