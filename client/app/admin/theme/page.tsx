'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api/client'

const COLOR_PRESETS = [
  { name: 'زرشکی', primary: '#722F37', accent: '#D4AF37' },
  { name: 'آبی', primary: '#1e40af', accent: '#f59e0b' },
  { name: 'سبز', primary: '#166534', accent: '#eab308' },
  { name: 'بنفش', primary: '#6b21a8', accent: '#ec4899' },
  { name: 'مشکی', primary: '#171717', accent: '#f97316' },
]

// ========== بخش 1: اطلاعات رستوران ==========
function RestaurantInfoSection({ settings, setSettings }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">اطلاعات رستوران</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">نام رستوران</label>
          <Input
            value={settings.restaurantName}
            onChange={(e) =>
              setSettings({ ...settings, restaurantName: e.target.value })
            }
            placeholder="نام رستوران"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">آدرس لوگو</label>
          <Input
            value={settings.restaurantLogo}
            onChange={(e) =>
              setSettings({ ...settings, restaurantLogo: e.target.value })
            }
            placeholder="/images/logo.png"
            dir="ltr"
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ========== بخش 2: تم‌های آماده ==========
function ColorPresetsSection({ settings, setSettings }: any) {
  const applyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    setSettings({
      ...settings,
      primaryColor: preset.primary,
      accentColor: preset.accent,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">تم‌های آماده</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex gap-1">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: preset.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ========== بخش 3: رنگ‌های سفارشی ==========
function CustomColorsSection({ settings, setSettings }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">رنگ‌های سفارشی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">رنگ اصلی</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) =>
                setSettings({ ...settings, primaryColor: e.target.value })
              }
              className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
            />
            <Input
              value={settings.primaryColor}
              onChange={(e) =>
                setSettings({ ...settings, primaryColor: e.target.value })
              }
              className="flex-1"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">رنگ تاکیدی (طلایی)</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) =>
                setSettings({ ...settings, accentColor: e.target.value })
              }
              className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
            />
            <Input
              value={settings.accentColor}
              onChange={(e) =>
                setSettings({ ...settings, accentColor: e.target.value })
              }
              className="flex-1"
              dir="ltr"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ========== بخش 4: گردی گوشه‌ها ==========
function BorderRadiusSection({ settings, setSettings }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">گردی گوشه‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Slider
            value={[settings.borderRadius]}
            onValueChange={(value) =>
              setSettings({ ...settings, borderRadius: value[0] })
            }
            min={0}
            max={24}
            step={2}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>تیز</span>
            <span className="font-medium text-foreground">
              {settings.borderRadius}px
            </span>
            <span>گرد</span>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">پیش‌نمایش:</p>
            <div
              className="p-4 text-white font-medium text-center"
              style={{
                backgroundColor: settings.primaryColor,
                borderRadius: `${settings.borderRadius}px`,
              }}
            >
              نمونه دکمه
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ========== بخش 5: تذکر ==========
function NoteSection() {
  return (
    <div className="p-4 bg-muted/50 rounded-lg">
      <p className="text-sm text-muted-foreground">
        توجه: برای اعمال تغییرات رنگ در کل اپلیکیشن، نیاز به به‌روزرسانی
        فایل CSS است. این تنظیمات فعلا ذخیره می‌شوند.
      </p>
    </div>
  )
}

// ========== صفحه اصلی ==========
export default function AdminThemePage() {
  const [settings, setSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        // دریافت تنظیمات از Business پروفایل
        const response = await api.get('/business/profile')
        const business = response.data.business

        if (business) {
          setSettings({
            restaurantName: business.name,
            restaurantLogo: business.logoUrl || '/logo.png',
            primaryColor: business.primaryColor || '#722F37',
            accentColor: '#D4AF37', // رنگ ثابت طلایی
            borderRadius: 12,
          })
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        toast.error('خطا در دریافت تنظیمات')
        // دیتای پیش‌فرض
        setSettings({
          restaurantName: 'رستوران من',
          restaurantLogo: '/logo.png',
          primaryColor: '#722F37',
          accentColor: '#D4AF37',
          borderRadius: 12,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    if (!settings) return

    setIsSaving(true)

    try {
      // ذخیره تنظیمات در Business
      await api.put('/business/profile', {
        name: settings.restaurantName,
        primaryColor: settings.primaryColor,
      })

      toast.success('تنظیمات ذخیره شد')

      // به‌روزرسانی صفحه
      window.location.reload()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'خطا در ذخیره تنظیمات')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">خطا در بارگذاری تنظیمات</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    )
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
            <h1 className="font-bold text-foreground">تنظیمات ظاهری</h1>
          </div>

          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 ml-1" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <RestaurantInfoSection settings={settings} setSettings={setSettings} />
        <ColorPresetsSection settings={settings} setSettings={setSettings} />
        <CustomColorsSection settings={settings} setSettings={setSettings} />
        <BorderRadiusSection settings={settings} setSettings={setSettings} />
        <NoteSection />
      </div>
    </main>
  )
}