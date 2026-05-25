'use client'

import Image from 'next/image'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'  // ← از اینجا تایپ می‌آید
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'

// ✅ تایپ را از cart-store بگیر
import type { CartItem as StoreCartItem } from '@/lib/store/cart-store'

interface CartItemProps {
  item: StoreCartItem  // ← استفاده از تایپ store
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  if (!item || !item.menuItem) {
    return null
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.menuItem._id, item.quantity - 1)
    } else {
      removeItem(item.menuItem._id)
    }
  }

  const handleIncrease = () => {
    updateQuantity(item.menuItem._id, item.quantity + 1)
  }

  const handleRemove = () => {
    removeItem(item.menuItem._id)
  }

  const itemTotal = (item.menuItem.price || 0) * (item.quantity || 0)

  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-0">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        {item.menuItem.imageUrl ? (
          <Image
            src={item.menuItem.imageUrl}
            alt={item.menuItem.name || 'محصول'}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">بدون عکس</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-foreground text-sm line-clamp-1">
            {item.menuItem.name || 'بدون نام'}
          </h3>
          <p className="text-muted-foreground text-xs mt-0.5">
            {formatPrice(item.menuItem.price || 0)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-muted rounded-full p-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDecrease}
              className="h-7 w-7 rounded-full"
            >
              {item.quantity === 1 ? (
                <Trash2 className="h-3 w-3 text-destructive" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </Button>
            <span className="font-bold min-w-[1.5rem] text-center">
              {toPersianNumber(item.quantity)}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleIncrease}
              className="h-7 w-7 rounded-full"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <span className="font-bold text-primary text-sm">
            {formatPrice(itemTotal)}
          </span>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleRemove}
        className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0 self-start"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">حذف</span>
      </Button>
    </div>
  )
}