import PaymentResultContent from '@/components/result-content'
import { Suspense } from 'react'

export default function PaymentResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">در حال بارگذاری نتیجه پرداخت...</div>
            </div>
        }>
            <PaymentResultContent />
        </Suspense>
    )
}