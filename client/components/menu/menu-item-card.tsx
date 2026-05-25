'use client'

import Image from 'next/image'
import { Plus, Minus, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store/cart-store'
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MenuItemModal } from './menu-item-modal'

interface MenuItemCardProps {
  item: Product
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCartStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const cartItem = items.find((ci) => ci.menuItem._id === item._id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(item)
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity > 0) {
      updateQuantity(item._id, quantity - 1)
    }
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateQuantity(item._id, quantity + 1)
  }

  return (
    <>
      <div
        className={cn(
          'group relative bg-card rounded-2xl overflow-hidden cursor-pointer',
          'border border-border transition-all duration-300',
          isHovered && 'shadow-xl -translate-y-0.5 border-primary/30',
          !item.isAvailable && 'opacity-50'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex gap-4 p-4">
          {/* Image Section */}
          <div className="relative">
            <div className={cn(
              'relative max-[423px]:w-[139px] w-24 h-full rounded-2xl overflow-hidden flex-shrink-0',
              'bg-gradient-to-br from-primary/5 to-primary/10',
              'transition-all duration-300',
              isHovered && 'shadow-md'
            )}>
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-500',
                    isHovered && 'scale-110'
                  )}
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-primary/40" />
                </div>
              )}

              {item.discountPrice && item.discountPrice < item.price && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                  {Math.round(((item.price - item.discountPrice) / item.price) * 100)}%
                </div>
              )}
            </div>

            {quantity > 0 && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg animate-bounce">
                {toPersianNumber(quantity)}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
            </div>

            <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">
              {item.description || 'لذیذ و خوشمزه'}
            </p>

            {/* قیمت و دکمه‌ها - با قابلیت responsive */}
            <div className="flex items-center justify-between max-[423px]:flex-col max-[423px]:items-stretch max-[423px]:gap-2">
              <div className="flex items-baseline gap-1 ">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(item.discountPrice || item.price)}
                </span>
                {item.discountPrice && item.discountPrice < item.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>

              {item.isAvailable ? (
                <div className="flex items-center  gap-2 max-[423px]:justify-end" onClick={(e) => e.stopPropagation()}>
                  {quantity === 0 ? (
                    <Button
                      size="sm"
                      onClick={handleAdd}
                      className={cn(
                        'h-9 px-4 rounded-xl bg-primary text-primary-foreground',
                        'hover:bg-primary/90 transition-all duration-300',
                        isHovered && 'shadow-md'
                      )}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 bg-primary/10 rounded-xl p-1">
                      <button
                        onClick={handleDecrease}
                        className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-all duration-200 hover:scale-105"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-primary min-w-[1.75rem] text-center">
                        {toPersianNumber(quantity)}
                      </span>
                      <button
                        onClick={handleIncrease}
                        className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-xs text-red-500 bg-red-50 dark:bg-red-950 px-2 py-1 rounded-lg max-[423px]:self-start">
                  ناموجود
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Gradient Line */}
        <div className={cn(
          'h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500',
          isHovered ? 'opacity-100' : 'opacity-0'
        )} />
      </div>

      {/* Modal */}
      <MenuItemModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}