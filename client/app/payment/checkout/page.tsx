import PaymentCheckoutContent from '@/components/checkout-content'
import { Suspense } from 'react'

export default function PaymentCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="animate-pulse text-muted-foreground">در حال بارگذاری درگاه پرداخت...</div>
      </div>
    }>
      <PaymentCheckoutContent />
    </Suspense>
  )
}