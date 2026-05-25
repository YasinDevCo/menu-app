'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import type { Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/lib/hooks/useCategories'
import { useQueryClient } from '@tanstack/react-query'
import { CategoryIcon, CATEGORY_ICON_LIST, categoryIconMap } from '@/components/icons/CategoryIcons'
import { cn } from '@/lib/utils'

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const { data: categories = [], isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [formData, setFormData] = useState({
    title: '',
    icon: 'نوشیدنی‌های گرم',
  })

  const resetForm = () => {
    setFormData({ title: '', icon: 'نوشیدنی‌های گرم' })
    setEditingCategory(null)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      title: category.title,
      icon: category.icon || 'نوشیدنی‌های گرم',
    })
    setIsDialogOpen(true)
  }

  const handleIconSelect = (iconTitle: string) => {
    setFormData(prev => ({
      ...prev,
      icon: iconTitle,
      title: prev.title || iconTitle,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('نام دسته‌بندی الزامی است')
      return
    }

    if (editingCategory) {
      updateCategory.mutate({
        id: editingCategory._id,
        data: { title: formData.title, icon: formData.icon }
      }, { onSuccess: () => { setIsDialogOpen(false); resetForm() } })
    } else {
      createCategory.mutate({
        title: formData.title,
        icon: formData.icon,
        priority: categories.length
      }, { onSuccess: () => { setIsDialogOpen(false); resetForm() } })
    }
  }

  const handleDelete = (id: string) => deleteCategory.mutate(id)

  const getIconForCategory = (iconName: string) => {
    const IconComp = categoryIconMap[iconName]
    return IconComp ? <IconComp size={20} /> : <span className="text-base">🍽️</span>
  }

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link href="/admin/dashboard">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <div className="h-5 w-px bg-border" />
            <h1 className="font-bold text-foreground text-lg">دسته‌بندی‌ها</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 rounded-full">
                <Plus className="h-4 w-4" />
                افزودن
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingCategory ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">نام دسته‌بندی</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: نوشیدنی‌های گرم"
                    className="rounded-xl"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">با انتخاب آیکون، نام به صورت خودکار پر می‌شود</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">آیکون</label>
                  <div className="grid grid-cols-4 gap-1.5 max-h-52 overflow-y-auto p-1">
                    {CATEGORY_ICON_LIST.map((iconTitle) => {
                      const IconComp = categoryIconMap[iconTitle]
                      return (
                        <button
                          key={iconTitle}
                          type="button"
                          onClick={() => handleIconSelect(iconTitle)}
                          className={cn(
                            'p-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-all',
                            formData.icon === iconTitle
                              ? 'bg-primary/20 ring-1 ring-primary'
                              : 'bg-muted/50 hover:bg-muted'
                          )}
                        >
                          {IconComp && <IconComp size={24} />}
                          <span className="text-[9px] text-muted-foreground truncate w-full text-center">{iconTitle.slice(0, 8)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-xl" disabled={createCategory.isPending || updateCategory.isPending}>
                  {createCategory.isPending || updateCategory.isPending ? 'در حال ذخیره...' : (editingCategory ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📁</span>
            </div>
            <p className="text-muted-foreground mb-4">هنوز دسته‌بندی‌ای اضافه نشده است</p>
            <Button onClick={() => setIsDialogOpen(true)} className="rounded-full gap-1">
              <Plus className="h-4 w-4" />
              افزودن دسته‌بندی
            </Button>
          </div>
        ) : (
          <div className="grid gap-2">
            {categories.map((category) => (
            <Card
  key={category._id}
  className="group overflow-hidden rounded-xl border-border/60 bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3">
    {/* Drag Handle */}
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <GripVertical className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-sm">
        {getIconForCategory(category.icon || 'نوشیدنی‌های گرم')}
      </div>
    </div>

    {/* Title */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors line-clamp-1">
        {category.title}
      </h3>
      <p className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
        {category.icon || 'بدون آیکون'}
      </p>
    </div>

    {/* Actions */}
    <div className="flex gap-0.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity self-end sm:self-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => openEditDialog(category)}
        className="h-8 w-8 rounded-full hover:bg-primary/10"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف دسته‌بندی</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف "{category.title}" مطمئن هستید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(category._id)}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}