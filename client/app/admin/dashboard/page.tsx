'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  UtensilsCrossed,
  FolderOpen,
  Palette,
  LogOut,
  LayoutDashboard,
  Store,
  Key,
  ClipboardList,
  BellRing,
  TrendingUp,
  Percent
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth-store'

const adminLinks = [
  {
    href: '/admin/orders',
    title: 'سفارشات',
    description: 'مشاهده و مدیریت سفارشات دریافتی',
    icon: ClipboardList,
  },
  {
    href: '/admin/change-password',
    title: 'تغییر رمز عبور',
    description: 'تغییر رمز ورود به پنل مدیریت',
    icon: Key,
  },
  {
    href: '/admin/profile',
    title: 'پروفایل رستوران',
    description: 'ویرایش اطلاعات رستوران، لوگو و تنظیمات',
    icon: Store,
  },
  {
    href: '/admin/menu',
    title: 'مدیریت منو',
    description: 'افزودن، ویرایش و حذف آیتم‌های منو',
    icon: UtensilsCrossed,
  },
  {
    href: '/admin/categories',
    title: 'دسته‌بندی‌ها',
    description: 'مدیریت دسته‌بندی‌های منو',
    icon: FolderOpen,
  },
  {
    href: '/admin/theme',
    title: 'تنظیمات ظاهری',
    description: 'تغییر رنگ‌ها و ظاهر اپلیکیشن',
    icon: Palette,
  }, {
    href: '/admin/reports',
    title: 'گزارشات فروش',
    description: 'مشاهده آمار و نمودارهای فروش',
    icon: TrendingUp,
  },
  {
    href: '/admin/coupons',
    title: 'کدهای تخفیف',
    description: 'مدیریت کدهای تخفیف',
    icon: Percent,
  },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    logout()
    toast.success('خروج موفق')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-bold text-foreground">پنل مدیریت</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-foreground mb-1">
            خوش آمدید!
          </h2>
          <p className="text-muted-foreground text-sm">
            از این پنل می‌توانید منو و تنظیمات رستوران را مدیریت کنید.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full card-hover cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{link.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick View Link */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              مشاهده منو از دید مشتری:
            </p>
            <p className="text-xs text-muted-foreground">
              لینک مستقیم منوی رستوران
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/menu" target="_blank">
              <UtensilsCrossed className="h-4 w-4" />
              مشاهده منو
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}