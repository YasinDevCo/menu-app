'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Plus, Pencil, Trash2, Eye, EyeOff, Upload } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { formatPrice } from '@/lib/utils/format'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api/client'
import { useCategories } from '@/lib/hooks/useCategories'
import { useProducts, useDeleteProduct, useToggleProductAvailability } from '@/lib/hooks/useProducts'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

export default function AdminMenuPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | null>(null)

  // هوک‌های React Query
  const { data: products = [], isLoading: productsLoading } = useProducts()
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const deleteProduct = useDeleteProduct()
  const toggleAvailability = useToggleProductAvailability()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isAvailable: true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const isLoading = productsLoading || categoriesLoading

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      isAvailable: true,
    })
    setImageFile(null)
    setImagePreview('')
    setEditingItem(null)
  }

  const openEditDialog = (item: Product) => {
    if (categories.length === 0 && !categoriesLoading) {
      toast.error('لطفاً ابتدا یک دسته‌بندی ایجاد کنید')
      return
    }

    // استخراج categoryId از آبجکت یا string
    const categoryIdValue = typeof item.categoryId === 'object'
      ? item.categoryId?._id
      : item.categoryId

    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      categoryId: categoryIdValue || (categories[0]?._id || ''),
      isAvailable: item.isAvailable,
    })
    setImagePreview(item.imageUrl || '')
    setImageFile(null)
    setIsDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم فایل نباید بیشتر از 5 مگابایت باشد')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('فایل باید تصویر باشد')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('نام، قیمت و دسته‌بندی الزامی است')
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('categoryId', formData.categoryId)
      formDataToSend.append('isAvailable', String(formData.isAvailable))

      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      if (editingItem) {
        // Update
        if (imageFile) {
          await api.put(`/products/${editingItem._id}`, formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        } else {
          await api.put(`/products/${editingItem._id}`, {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            categoryId: formData.categoryId,
            isAvailable: formData.isAvailable,
          })
        }
        toast.success('آیتم به‌روزرسانی شد')
      } else {
        // Create
        await api.post('/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('آیتم اضافه شد')
      }

      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'خطا در ذخیره آیتم')
    }
  }

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id)
  }

  const handleToggleAvailability = (item: Product) => {
    toggleAvailability.mutate(item._id)
  }

  const getCategoryName = (category: any) => {
    if (category && typeof category === 'object' && category.title) {
      return category.title
    }
    if (typeof category === 'string') {
      return categories.find((c) => c._id === category)?.title || '-'
    }
    return '-'
  }
  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/dashboard">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-foreground">مدیریت منو</h1>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 ml-1" />
                افزودن
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'ویرایش آیتم' : 'افزودن آیتم جدید'}
                </DialogTitle>
              </DialogHeader>

              {/* بررسی وجود دسته‌بندی */}
              {categories.length === 0 && !categoriesLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">هیچ دسته‌بندی وجود ندارد</p>
                  <Button asChild variant="outline">
                    <Link href="/admin/categories">ساخت دسته‌بندی جدید</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">نام</label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="نام غذا"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      توضیحات
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="توضیحات غذا"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      قیمت (تومان)
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="مثال: 280000"
                      dir="ltr"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      دسته‌بندی
                    </label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      تصویر محصول
                    </label>
                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          فرمت‌های مجاز: jpg, png, webp - حداکثر 5MB
                        </p>
                      </div>
                      {(imagePreview || (editingItem && editingItem.imageUrl)) && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={imagePreview || editingItem?.imageUrl || ''}
                            alt="پیش‌نمایش"
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">موجود</label>
                    <Switch
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isAvailable: checked })
                      }
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {editingItem ? 'ذخیره تغییرات' : 'افزودن آیتم'}
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              هنوز آیتمی اضافه نشده است
            </p>
            <Button onClick={() => {
              if (categories.length === 0) {
                toast.error('لطفاً ابتدا یک دسته‌بندی ایجاد کنید')
                return
              }
              setIsDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 ml-1" />
              افزودن اولین آیتم
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((item) => (
              <Card
                key={item._id}
                className="group overflow-hidden rounded-xl border-border/60 bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-3 p-3">
                  {/* Image */}
                  <div className="relative w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getCategoryName(item.categoryId)}
                        </p>
                      </div>
                      <Badge
                        variant={item.isAvailable ? 'default' : 'secondary'}
                        className={cn(
                          "rounded-full text-[10px] px-2.5 py-0.5 shrink-0",
                          item.isAvailable ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : ""
                        )}
                      >
                        {item.isAvailable ? 'موجود' : 'ناموجود'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
                      <p className="text-primary font-bold text-base">
                        {formatPrice(item.price)}
                      </p>

                      <div className="flex gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleAvailability(item)}
                          className="h-8 w-8 rounded-full"
                          title={item.isAvailable ? 'غیرفعال کردن' : 'فعال کردن'}
                        >
                          {item.isAvailable ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                          className="h-8 w-8 rounded-full"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>حذف آیتم</AlertDialogTitle>
                              <AlertDialogDescription>
                                آیا از حذف "{item.name}" مطمئن هستید؟
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>انصراف</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item._id)}>
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
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