'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, Pencil, Trash2, Percent, DollarSign } from 'lucide-react'
import { useCoupons, useCreateCoupon, useDeleteCoupon } from '@/lib/hooks/useCoupon'
import { formatPrice, toPersianNumber } from '@/lib/utils/format'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function AdminCouponsPage() {
    const { data: coupons = [], isLoading } = useCoupons()
    const createCoupon = useCreateCoupon()
    const deleteCoupon = useDeleteCoupon()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        code: '',
        type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
        value: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '1',
        validUntil: '',
    })

    const resetForm = () => {
        setFormData({
            code: '',
            type: 'PERCENTAGE',
            value: '',
            minOrderAmount: '',
            maxDiscountAmount: '',
            usageLimit: '1',
            validUntil: '',
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.code || !formData.value || !formData.validUntil) {
            toast.error('کد تخفیف، مقدار و تاریخ انقضا الزامی است')
            return
        }

        createCoupon.mutate({
            code: formData.code,
            type: formData.type,
            value: Number(formData.value),
            minOrderAmount: Number(formData.minOrderAmount) || 0,
            maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
            usageLimit: Number(formData.usageLimit),
            validUntil: formData.validUntil,
        }, {
            onSuccess: () => {
                setIsDialogOpen(false)
                resetForm()
            }
        })
    }

    const getTypeLabel = (type: string, value: number) => {
        if (type === 'PERCENTAGE') {
            return `${value}% تخفیف`
        }
        return `${formatPrice(value)} تخفیف`
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
                        <h1 className="font-bold text-foreground">کدهای تخفیف</h1>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 ml-1" />
                                افزودن
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>افزودن کد تخفیف جدید</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>کد تخفیف</Label>
                                    <Input
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        placeholder="مثال: SUMMER20"
                                        className="font-mono"
                                    />
                                </div>

                                <div>
                                    <Label>نوع تخفیف</Label>
                                    <div className="flex gap-3 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'PERCENTAGE' })}
                                            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors ${formData.type === 'PERCENTAGE' ? 'border-primary bg-primary/10' : 'border-border'}`}
                                        >
                                            <Percent className="h-4 w-4" />
                                            درصدی
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'FIXED' })}
                                            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-colors ${formData.type === 'FIXED' ? 'border-primary bg-primary/10' : 'border-border'}`}
                                        >
                                            <DollarSign className="h-4 w-4" />
                                            مبلغ ثابت
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label>{formData.type === 'PERCENTAGE' ? 'درصد تخفیف' : 'مبلغ تخفیف (تومان)'}</Label>
                                    <Input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        placeholder={formData.type === 'PERCENTAGE' ? 'مثال: 20' : 'مثال: 50000'}
                                    />
                                </div>

                                <div>
                                    <Label>حداقل مبلغ سفارش (تومان)</Label>
                                    <Input
                                        type="number"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                        placeholder="اختیاری"
                                    />
                                </div>

                                {formData.type === 'PERCENTAGE' && (
                                    <div>
                                        <Label>حداکثر مبلغ تخفیف (تومان)</Label>
                                        <Input
                                            type="number"
                                            value={formData.maxDiscountAmount}
                                            onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                                            placeholder="اختیاری"
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label>تعداد دفعات استفاده</Label>
                                    <Input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                        placeholder="مثال: 1"
                                    />
                                </div>

                                <div>
                                    <Label>تاریخ انقضا</Label>
                                    <Input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={createCoupon.isPending}>
                                    {createCoupon.isPending ? 'در حال ایجاد...' : 'ایجاد کد تخفیف'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Content */}
            <div className="p-4 max-w-4xl mx-auto">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">هیچ کد تخفیفی ایجاد نشده است</p>
                        <Button onClick={() => setIsDialogOpen(true)}>افزودن اولین کد تخفیف</Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {coupons.map((coupon) => (
                            <Card key={coupon._id} className="p-4 flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        {coupon.type === 'PERCENTAGE' ? (
                                            <Percent className="h-5 w-5 text-primary" />
                                        ) : (
                                            <DollarSign className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-lg">{coupon.code}</span>
                                            <Badge variant={coupon.isActive ? 'default' : 'secondary'} className="rounded-full">
                                                {coupon.isActive ? 'فعال' : 'غیرفعال'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {getTypeLabel(coupon.type, coupon.value)}
                                            {coupon.minOrderAmount > 0 && ` | حداقل سفارش ${formatPrice(coupon.minOrderAmount)}`}
                                            {coupon.usageLimit > 0 && ` | ${toPersianNumber(coupon.usedCount)}/${toPersianNumber(coupon.usageLimit)} استفاده`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>حذف کد تخفیف</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    آیا از حذف کد "{coupon.code}" مطمئن هستید؟
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>انصراف</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => deleteCoupon.mutate(coupon._id)}>
                                                    حذف
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}