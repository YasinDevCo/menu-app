'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/auth-store'

export default function AdminProfilePage() {
    const { business, login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        phoneNumber: '',
        slug: '',
    })
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState('')

    useEffect(() => {
        if (business) {
            setFormData({
                name: business.name,
                ownerName: business.ownerName || '',  // ← اصلاح شد
                phoneNumber: business.phoneNumber,
                slug: business.slug,
            })
        }
    }, [business])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد')
                return
            }
            if (!file.type.startsWith('image/')) {
                toast.error('فایل باید تصویر باشد')
                return
            }
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('ownerName', formData.ownerName)
            formDataToSend.append('phoneNumber', formData.phoneNumber)
            formDataToSend.append('slug', formData.slug)

            if (logoFile) {
                formDataToSend.append('logo', logoFile)
            }

            const response = await api.put('/business/profile', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data.success) {
                // به‌روزرسانی store
                login(response.data.token || '', response.data.business)
                toast.success('اطلاعات رستوران به‌روزرسانی شد')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error?.message || 'خطا در ذخیره اطلاعات')
        } finally {
            setIsLoading(false)
        }
    }

    if (!business) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-2xl mx-auto">
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background" dir="rtl">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-50">
                <div className="flex items-center h-14 px-4 max-w-4xl mx-auto">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/dashboard">
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="font-bold text-foreground mr-2">پروفایل رستوران</h1>
                </div>
            </header>

            {/* Content */}
            <div className="p-4 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>اطلاعات رستوران</CardTitle>
                            <CardDescription>
                                اطلاعات اصلی رستوران خود را ویرایش کنید
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">نام رستوران</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="مثال: رستوران سنتی"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="ownerName">نام صاحب رستوران</Label>
                                <Input
                                    id="ownerName"
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    placeholder="نام مالک"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phoneNumber">شماره موبایل</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="09123456789"
                                    dir="ltr"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="slug">اسلاگ (آدرس اینترنتی)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="مثال: restaurant"
                                    dir="ltr"
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    آدرس منو: http://localhost:3000/menu/{formData.slug}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>لوگو رستوران</CardTitle>
                            <CardDescription>
                                لوگوی رستوران خود را آپلود کنید
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        فرمت‌های مجاز: jpg, png, webp - حداکثر 2MB
                                    </p>
                                </div>
                                {(logoPreview || business.logoUrl) && (
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
                                        <Image
                                            src={logoPreview || business.logoUrl || ''}
                                            alt="لوگو"
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        <Save className="h-4 w-4 ml-2" />
                        {isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                    </Button>
                </form>
            </div>
        </main>
    )
}