'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { toPersianNumber } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface HeaderProps {
  title?: string
  showCart?: boolean
  showBack?: boolean
  backHref?: string
}

export function Header({
  title = 'رستوران سنتی',
  showCart = true,
  showBack = false,
  backHref = '/menu',
}: HeaderProps) {
  const totalItems = useCartStore((state) => state.getTotalItems())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {showBack ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href={backHref}>
              <span>بازگشت</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-180"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </Button>
        ) : (
          <div className="w-20" />
        )}

        <h1 className="text-lg font-bold text-foreground">{title}</h1>

        {showCart ? (
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {toPersianNumber(totalItems)}
                </span>
              )}
              <span className="sr-only">سبد خرید</span>
            </Link>
          </Button>
        ) : (
          <div className="w-9" />
        )}
      </div>
    </header>
  )
}