'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Save, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/auth-store'

export default function AdminChangePasswordPage() {
  const { logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('لطفاً تمام فیلدها را پر کنید')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('رمز عبور جدید و تکرار آن مطابقت ندارند')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('رمز عبور جدید باید حداقل 6 کاراکتر باشد')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.put('/business/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })

      if (response.data.success) {
        toast.success('رمز عبور با موفقیت تغییر کرد')
        // خروج از حساب و هدایت به صفحه ورود
        setTimeout(() => {
          logout()
          window.location.href = '/admin'
        }, 2000)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'خطا در تغییر رمز عبور'
      toast.error(errorMessage)
      
      // اگر رمز قدیم اشتباه بود، فیلد را خالی کن
      if (errorMessage.includes('رمز عبور فعلی اشتباه است')) {
        setFormData(prev => ({ ...prev, oldPassword: '' }))
      }
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="font-bold text-foreground mr-2">تغییر رمز عبور</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تغییر رمز عبور</CardTitle>
              <CardDescription>
                برای امنیت بیشتر، رمز عبور خود را مرتباً تغییر دهید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* رمز فعلی */}
              <div>
                <Label htmlFor="oldPassword">رمز عبور فعلی</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    value={formData.oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    placeholder="رمز عبور فعلی را وارد کنید"
                    className="pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* رمز جدید */}
              <div>
                <Label htmlFor="newPassword">رمز عبور جدید</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="رمز عبور جدید (حداقل 6 کاراکتر)"
                    className="pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* تکرار رمز جدید */}
              <div>
                <Label htmlFor="confirmPassword">تکرار رمز عبور جدید</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="رمز عبور جدید را دوباره وارد کنید"
                    className="pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-full">
            <Save className="h-4 w-4 ml-2" />
            {isLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
          </Button>
        </form>
      </div>
    </main>
  )
}