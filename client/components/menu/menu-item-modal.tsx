'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Plus, Minus, Star } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store/cart-store'
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MenuItemModalProps {
    item: Product | null
    isOpen: boolean
    onClose: () => void
}

export function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
    const { items, addItem } = useCartStore()
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
            setQuantity(1)
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!item) return null

    const cartItem = items.find((ci) => ci.menuItem._id === item._id)
    const existingQuantity = cartItem?.quantity || 0

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const handleIncrease = () => {
        setQuantity(quantity + 1)
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addItem(item)
        onClose()
    }

    const discountedPrice = item.discountPrice || item.price
    const discountPercent = item.discountPrice
        ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
        : 0

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/70 z-50 transition-all duration-300',
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                )}
                onClick={onClose}
            />

            {/* Modal Bottom Sheet - ریسپانسیو */}
            <div
                className={cn(
                    'fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 transition-transform duration-300 ease-out',
                    'max-h-[80vh] overflow-y-auto',
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                )}
            >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute left-4 top-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Image - ریسپانسیو */}
                <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-br from-primary/10 to-primary/5">
                    {item.imageUrl ? (
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl sm:text-6xl md:text-7xl">🍽️</span>
                        </div>
                    )}

                    {discountPercent > 0 && (
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg">
                            {discountPercent}% تخفیف
                        </div>
                    )}
                </div>

                {/* Content - ریسپانسیو */}
                <div className="p-4 sm:p-5 md:p-6">
                    {/* Title & Rating */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                            {item.name}
                        </h2>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded-full self-start sm:self-auto">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs sm:text-sm font-medium">4.5</span>
                        </div>
                    </div>

                    {/* Price - ریسپانسیو */}
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                            {formatPrice(discountedPrice)}
                        </span>
                        {item.discountPrice && (
                            <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                {formatPrice(item.price)}
                            </span>
                        )}
                        <span className="text-xs text-muted-foreground">تومان</span>
                    </div>

                    {/* Description */}
                    <div className="mb-4 sm:mb-6">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2">توضیحات محصول</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                            {item.description || 'لذیذ و خوشمزه - تهیه شده از بهترین مواد اولیه'}
                        </p>
                    </div>

                    {/* Ingredients - ریسپانسیو */}
                    <div className="mb-4 sm:mb-6">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2">مواد اولیه</h3>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {['گوشت گوساله', 'پنیر مخصوص', 'قارچ', 'فلفل دلمه', 'سس مخصوص'].map((ing) => (
                                <span key={ing} className="text-[10px] sm:text-xs bg-muted px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Preparation Time */}
                    <div className="flex items-center gap-2 mb-4 sm:mb-6 text-xs sm:text-sm text-muted-foreground">
                        <span>⏱️ زمان آماده‌سازی:</span>
                        <span className="font-medium text-foreground">{item.preparationTime || 15} دقیقه</span>
                    </div>

                    {/* Quantity Selector - ریسپانسیو */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-2xl">
                        <span className="font-medium">تعداد</span>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleDecrease}
                                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-xl font-bold min-w-[2rem] text-center">
                                {toPersianNumber(quantity)}
                            </span>
                            <button
                                onClick={handleIncrease}
                                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Total Price & Add Button - ریسپانسیو */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3   ">
                        <div className="flex-1 text-center sm:text-right">
                            <p className="text-xs text-muted-foreground">قیمت نهایی</p>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                                {formatPrice(discountedPrice * quantity)}
                            </p>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            className="h-10 sm:h-12 rounded-xl gap-2 text-sm sm:text-base mb-12"
                        >
                            <Plus className="w-4 h-4" />
                            افزودن به سبد خرید
                        </Button>
                    </div>

                    {/* Already in cart info */}
                    {existingQuantity > 0 && (
                        <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-4">
                            {toPersianNumber(existingQuantity)} عدد از این محصول در سبد خرید شما وجود دارد
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}