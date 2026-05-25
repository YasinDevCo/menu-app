'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { categoryIconMap, AllIcon } from '@/components/icons/CategoryIcons'

interface CategoryTabsProps {
  categories: { _id: string; title: string }[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

// آیکون پیش‌فرض برای دسته‌هایی که در map نیستند
const DefaultIcon = ({ size = 42 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="!size-[42px] shrink-0">
    <path d="M12 44C12 44 12 48 32 48C52 48 52 44 52 44H12Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M14 40C14 26 22 18 32 18C42 18 50 26 50 40H14Z" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="32" cy="14" r="3" fill="#D4AF37" />
    <path d="M22 32C22 32 26 28 32 28" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // گرفتن آیکون برای هر دسته
  const getCategoryIcon = (title: string) => {
    const Icon = categoryIconMap[title]
    if (Icon) {
      return <Icon size={42} className="!size-[42px] shrink-0" />
    }
    return <DefaultIcon size={42} />
  }

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="sticky top-14 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar scroll-smooth max-w-lg mx-auto"
      >
        {/* همه */}
        <Button
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          onClick={() => onCategoryChange('all')}
          className={cn(
            'border-0 flex-shrink-0 w-[115px] tap-target flex flex-col items-center justify-center h-auto py-2 transition-all duration-200',
            activeCategory === 'all' && 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
          )}
        >
          <AllIcon size={42} className="!size-[42px] shrink-0" />
          <span className="text-xs mt-1 font-medium">همه</span>
        </Button>

        {/* دسته‌بندی‌ها */}
        {categories.map((category) => (
          <Button
            key={category._id}
            variant={activeCategory === category._id ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category._id)}
            className={cn(
              'border-0 flex-shrink-0 w-[115px] rounded-xl tap-target flex flex-col items-center justify-center h-auto py-2 transition-all duration-200',
              activeCategory === category._id && 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
            )}
          >
            {getCategoryIcon(category.title)}
            <span className="text-xs mt-1 font-medium truncate w-full text-center">{category.title}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}