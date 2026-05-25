'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { toPersianNumber, formatPrice } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'

export function CartBadge() {
  const totalItems = useCartStore((state) => state.getTotalItems())
  const totalPrice = useCartStore((state) => state.getTotalPrice())

  if (totalItems === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto">
      <Button
        asChild
        size="lg"
        className="w-full h-14 rounded-xl shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Link href="/cart" className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {toPersianNumber(totalItems)}
              </span>
            </div>
            <span className="font-medium">مشاهده سبد خرید</span>
          </div>
          <span className="font-bold">{formatPrice(totalPrice)}</span>
        </Link>
      </Button>
    </div>
  )
}
