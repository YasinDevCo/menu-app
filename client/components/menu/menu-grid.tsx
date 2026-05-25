'use client'

import type { Product } from '@/lib/types'
import { MenuItemCard } from './menu-item-card'

interface MenuGridProps {
  items: Product[]
}

export function MenuGrid({ items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">آیتمی در این دسته‌بندی وجود ندارد</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 px-4 pb-24 max-w-lg mx-auto">
      {items.map((item) => (
        <MenuItemCard key={item._id} item={item} />
      ))}
    </div>
  )
}
