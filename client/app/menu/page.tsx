'use client'

import { useState } from 'react'
import { Header } from '@/components/shared/header'
import { CategoryTabs } from '@/components/menu/category-tabs'
import { MenuGrid } from '@/components/menu/menu-grid'
import { CartBadge } from '@/components/cart/cart-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MenuItemSkeleton } from '@/components/menu/menu-item-skeleton'
import { useMenu } from '@/lib/hooks/useMenu'
import { useCategories } from '@/lib/hooks/useCategories'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'
import { useWaiterCall } from '@/lib/hooks/useWaiterCall'

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { tableNumber } = useCartStore()
  const { mutate: callWaiter, isPending } = useWaiterCall()

  const {
    data: menuData,
    isLoading: menuLoading,
    error: menuError
  } = useMenu()

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useCategories()

  const isLoading = menuLoading || categoriesLoading

  const allProducts: Product[] = menuData?.menu?.flatMap((category: any) =>
    category.products.map((product: any) => ({
      ...product,
      categoryId: product.categoryId || category._id
    }))
  ) || []

  const filteredItems =
    activeCategory === 'all'
      ? allProducts
      : allProducts.filter((item: Product) => item.categoryId === activeCategory)

  if (menuError || categoriesError) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="منو" />
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">خطا در بارگذاری منو</p>
        </div>
      </div>
    )
  }

  const handleCallWaiter = () => {
    if (!tableNumber) {
      toast.error('لطفا ابتدا شماره میز را وارد کنید')
      return
    }
    callWaiter({
      tableNumber: Number(tableNumber),
      message: `درخواست گارسون - میز ${tableNumber}`
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="منو" />

      <Button
        onClick={handleCallWaiter}
        disabled={isPending}
        variant="outline"
        className="fixed bottom-24 right-4 z-50 gap-2 shadow-lg rounded-full bg-white dark:bg-gray-900"
      >
        <Bell className="h-4 w-4" />
        {isPending ? 'در حال ارسال...' : 'فراخوان گارسون'}
      </Button>

      {isLoading ? (
        <>
          {/* اسکلتون دسته‌بندی */}
          <div className="sticky top-14 z-40 bg-background border-b border-border">
            <div className="flex gap-2 px-4 py-3 overflow-x-auto max-w-lg mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-20 rounded-full flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* اسکلتون محصولات */}
          <div className="space-y-3 px-4 pb-24 max-w-lg mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <MenuItemSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          <CategoryTabs
            categories={menuData?.menu?.map((cat: any) => ({
              _id: cat._id,
              title: cat.title
            })) || []}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <div className="py-4">
            <MenuGrid items={filteredItems} />
          </div>
        </>
      )}

      <CartBadge />
    </div>
  )
}