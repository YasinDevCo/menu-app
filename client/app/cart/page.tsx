'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
import { Header } from '@/components/shared/header'
import { CartItem } from '@/components/cart/cart-item'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const router = useRouter()
  const { items, tableNumber, getTotalPrice, clearCart } = useCartStore()
  const createOrder = useCreateOrder()
  const [note, setNote] = useState('')

  const totalPrice = getTotalPrice()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmitOrder = async () => {
    if (!tableNumber) {
      toast.error('لطفا شماره میز را وارد کنید')
      router.push('/')
      return
    }

    if (items.length === 0) {
      toast.error('سبد خرید شما خالی است')
      return
    }

    const orderData = {
      businessSlug: 'cafe-yasin',
      tableNumber: Number(tableNumber),
      items: items.map(item => ({
        productId: item.menuItem._id,
        quantity: item.quantity,
        note: item.note
      })),
      note: note.trim(),
      payment: {
        method: 'CASH' as const
      }
    }

    try {
      const order = await createOrder.mutateAsync(orderData)
      clearCart()
      router.push(`/order-success?id=${order._id}`)
    } catch (error) {
      console.error('Order error:', error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="سبد خرید" showBack backHref="/menu" />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            سبد خرید شما خالی است
          </h2>
          <p className="text-muted-foreground mb-6">
            از منو غذای مورد علاقه‌تان را انتخاب کنید
          </p>
          <Button asChild>
            <Link href="/menu">مشاهده منو</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header title="سبد خرید" showBack backHref="/menu" />

      <div className="max-w-lg mx-auto">
        {/* Table Number */}
        <div className="px-4 py-3 bg-muted/50 border-b border-border">
          <p className="text-sm text-muted-foreground">
            شماره میز:{' '}
            <span className="font-bold text-foreground">
              {toPersianNumber(tableNumber || '-')}
            </span>
          </p>
        </div>

        {/* Cart Items */}
        <div className="px-4">
          {items.map((item) => (
            <CartItem key={item.menuItem._id} item={item} />
          ))}
        </div>

        {/* Note */}
        <div className="px-4 py-4">
          <label
            htmlFor="note"
            className="text-sm font-medium text-foreground mb-2 block"
          >
            یادداشت برای رستوران (اختیاری)
          </label>
          <Textarea
            id="note"
            placeholder="مثال: بدون پیاز لطفا..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              تعداد اقلام: {toPersianNumber(totalItems)}
            </span>
            <span className="font-bold text-lg text-foreground">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <Button
            onClick={handleSubmitOrder}
            disabled={createOrder.isPending}
            className="w-full h-12 text-base font-bold"
          >
            {createOrder.isPending ? 'در حال ثبت...' : 'ثبت سفارش'}
          </Button>
        </div>
      </div>
    </div>
  )
}