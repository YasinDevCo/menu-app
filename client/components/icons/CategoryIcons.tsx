'use client'

import { cn } from '@/lib/utils'

interface CategoryIconProps {
  title: string
  className?: string
  size?: number
}

// ۱. نوشیدنی‌های گرم (فنجان با بخار اسلیمی)
const HotBeverageIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 28H44C44 28 44 48 28 48C12 48 12 28 12 28Z" stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M44 32C48 32 52 34 52 38C52 42 48 44 44 44" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 12C22 12 24 16 22 20" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 10C28 10 30 14 28 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 52H46" stroke="#722F37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ۲. نوشیدنی‌های سرد (لیوان بلند با نی و یخ)
const ColdBeverageIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M18 16L24 54H40L46 16H18Z" stroke="#722F37" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M36 8L30 24" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="26" y="32" width="6" height="6" rx="1" stroke="#D4AF37" strokeWidth="1.5" />
    <circle cx="48" cy="20" r="3" fill="#D4AF37" />
  </svg>
)

// ۳. نوشیدنی‌های همراه غذا (بطری کلاسیک)
const BottledBeverageIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M26 8H38V14C38 14 44 18 44 26V56H20V26C20 18 26 14 26 14V8Z" stroke="#722F37" strokeWidth="2.5" />
    <line x1="20" y1="36" x2="44" y2="36" stroke="#D4AF37" strokeWidth="2" />
    <path d="M28 8L36 8" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// ۴. پیش‌غذا (سیب‌زمینی و دیپ در ظرف)
const AppetizerIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 48C12 48 16 56 32 56C48 56 52 48 52 48" stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="20" y="24" width="4" height="24" rx="1" stroke="#D4AF37" strokeWidth="2" />
    <rect x="28" y="16" width="4" height="32" rx="1" stroke="#D4AF37" strokeWidth="2" />
    <rect x="36" y="24" width="4" height="24" rx="1" stroke="#D4AF37" strokeWidth="2" />
  </svg>
)

// ۵. سالادها (کاسه با برگ ریحان)
const SaladIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M10 32C10 44 20 54 32 54C44 54 54 44 54 32H10Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M24 24C24 24 28 16 32 24C36 16 40 24 40 24" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="22" r="3" fill="#D4AF37" />
  </svg>
)

// ۶. غذای اصلی (بشقاب و کارد و چنگال متقارن)
const MainCourseIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="32" r="22" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="14" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 4" />
    <path d="M8 20V44" stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M56 20V44" stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

// ۷. صبحانه و برانچ (نیمرو و خورشید کوچک)
const BreakfastIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M48 36C48 44.8 40.8 52 32 52C23.2 52 16 44.8 16 36C16 27.2 28 12 32 12C36 12 48 27.2 48 36Z" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="32" cy="36" r="8" fill="#D4AF37" />
    <line x1="52" y1="12" x2="56" y2="8" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ۸. کیک و دسر (برش کیک با مروارید طلایی)
const DessertIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 48L32 54L52 48L52 32L32 24L12 32V48Z" stroke="#722F37" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M12 32L32 38L52 32" stroke="#722F37" strokeWidth="2" />
    <circle cx="32" cy="18" r="4" fill="#D4AF37" />
  </svg>
)

// ۹. میان‌وعده و بشقاب اشتراکی (تخته مزه)
const SharingPlatterIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="12" y="16" width="36" height="40" rx="4" stroke="#722F37" strokeWidth="2.5" />
    <path d="M48 24H54V48H48" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="24" cy="28" r="4" fill="#D4AF37" />
    <rect x="32" y="36" width="10" height="10" stroke="#D4AF37" strokeWidth="2" />
  </svg>
)

// ========== آیکون‌های جدید ==========

// ۱۰. ساندویچ (سبک ساب یا کلاب)
const SandwichIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 32C12 28 16 26 32 26C48 26 52 28 52 32V36C52 40 48 42 32 42C16 42 12 40 12 36V32Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M12 34H52" stroke="#D4AF37" strokeWidth="2" strokeDasharray="4 2" />
    <path d="M20 26L24 22M30 26L34 22M40 26L44 22" stroke="#D4AF37" strokeWidth="2" />
  </svg>
)

// ۱۱. پیتزا (برش مثلثی کلاسیک)
const PizzaIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M16 20L32 52L48 20C48 20 40 14 32 14C24 14 16 20 16 20Z" stroke="#722F37" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="32" cy="26" r="3" fill="#D4AF37" />
    <circle cx="26" cy="35" r="2" fill="#D4AF37" />
    <circle cx="38" cy="35" r="2" fill="#D4AF37" />
  </svg>
)

// ۱۲. همبرگر (برگر لایه‌ای)
const BurgerIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M14 32H50" stroke="#722F37" strokeWidth="4" strokeLinecap="round" />
    <path d="M16 32C16 22 24 20 32 20C40 20 48 22 48 32H16Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M16 38H48C48 44 42 46 32 46C22 46 16 44 16 38V38Z" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="26" cy="24" r="1.5" fill="#D4AF37" />
    <circle cx="32" cy="23" r="1.5" fill="#D4AF37" />
    <circle cx="38" cy="24" r="1.5" fill="#D4AF37" />
  </svg>
)

// ۱۳. برنج و کباب/خورشت (دیس سنتی)
const RiceKebabIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 44C12 44 16 52 32 52C48 52 52 44 52 44H12Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M18 44C18 36 24 30 32 30C40 30 46 36 46 44" stroke="#722F37" strokeWidth="2" />
    <path d="M32 26V34" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M28 28L30 30" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 28L34 30" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ۱۴. پاستا و نودل (کاسه و چنگال در حال چرخش)
const PastaIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M14 36H50C50 46 42 52 32 52C22 52 14 46 14 36Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M32 12V36" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 30C28 30 32 26 36 30" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M26 34C26 34 32 30 38 34" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ۱۵. استیک و باربیکیو (گوشت با استخوان)
const SteakIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M42 22C34 14 18 18 18 32C18 46 34 50 42 42C46 38 48 34 42 22Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M42 42L50 50M46 38L54 46" stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M26 28Q32 32 38 28" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ۱۶. سوپ و آش (کاسه داغ)
const SoupIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 28C12 40 21 50 32 50C43 50 52 40 52 28H12Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M26 12C26 12 28 16 26 20" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 10C32 10 34 14 32 18" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 12C38 12 40 16 38 20" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 32H10" stroke="#722F37" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
)

// ۱۷. فست‌فود ترکیبی / سوخاری (تکه مرغ سوخاری)
const FriedChickenIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M18 42C18 34 26 22 38 22C46 22 52 28 52 36C52 44 46 48 38 48C30 48 24 54 18 54" stroke="#722F37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M34 32H42M30 38H38" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="28" r="2" fill="#D4AF37" />
  </svg>
)

// ۱۸. بشقاب رژیمی و سلامت (آیکون سیب یا جوانه)
const HealthyIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M32 54C42 54 50 46 50 36C50 26 42 18 32 18C22 18 14 26 14 36C14 46 22 54 32 54Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M32 18V12C32 12 38 12 42 8" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M26 32Q32 38 38 32" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// ۱۹. منوی کودک (بستنی یا آبنبات)
const KidsMenuIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M22 32L32 54L42 32H22Z" stroke="#722F37" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M20 32C20 24 26 20 32 20C38 20 44 24 44 32" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="32" cy="28" r="3" fill="#D4AF37" />
    <circle cx="38" cy="24" r="2" fill="#D4AF37" />
  </svg>
)

// ۲۰. افزودنی‌ها و سس‌ها (ظرف کوچک سس)
const SaucesIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M20 20H44L40 52H24L20 20Z" stroke="#722F37" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M32 20V52" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 2" />
    <path d="M18 20C18 16 24 14 32 14C40 14 46 16 46 20" stroke="#722F37" strokeWidth="2" />
  </svg>
)

// ۲۱. میوه و تنقلات (برش پرتقال یا هندوانه)
const FruitsIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M52 32C52 43 43 52 32 52C21 52 12 43 12 32H52Z" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="32" cy="42" r="2" fill="#D4AF37" />
    <circle cx="22" cy="38" r="2" fill="#D4AF37" />
    <circle cx="42" cy="38" r="2" fill="#D4AF37" />
  </svg>
)

export const AllIcon = ({ size = 42, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 44C12 44 12 48 32 48C52 48 52 44 52 44H12Z" stroke="#722F37" strokeWidth="2.5" />
    <path d="M14 40C14 26 22 18 32 18C42 18 50 26 50 40H14Z" stroke="#722F37" strokeWidth="2.5" />
    <circle cx="32" cy="14" r="3" fill="#D4AF37" />
    <path d="M22 32C22 32 26 28 32 28" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
// ========== مپ کامل دسته‌بندی‌ها به آیکون ==========
export const categoryIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  // دسته‌های اصلی
  'نوشیدنی‌های گرم': HotBeverageIcon,
  'نوشیدنی‌های سرد': ColdBeverageIcon,
  'نوشیدنی‌های همراه غذا': BottledBeverageIcon,
  'پیش‌غذا': AppetizerIcon,
  'سالادها': SaladIcon,
  'غذای اصلی': MainCourseIcon,
  'صبحانه و برانچ': BreakfastIcon,
  'کیک و دسر': DessertIcon,
  'میان‌وعده و بشقاب اشتراکی': SharingPlatterIcon,

  // دسته‌های جدید
  'ساندویچ': SandwichIcon,
  'پیتزا': PizzaIcon,
  'همبرگر': BurgerIcon,
  'برنج و کباب': RiceKebabIcon,
  'پاستا': PastaIcon,
  'استیک و باربیکیو': SteakIcon,
  'سوپ و آش': SoupIcon,
  'فست فود': FriedChickenIcon,
  'رژیمی و سلامت': HealthyIcon,
  'منوی کودک': KidsMenuIcon,
  'افزودنی‌ها و سس‌ها': SaucesIcon,
  'میوه و تنقلات': FruitsIcon,
}

// لیست آیکون‌ها برای انتخاب در دیالوگ
export const CATEGORY_ICON_LIST = Object.keys(categoryIconMap)

// کامپوننت اصلی
export function CategoryIcon({ title, className, size = 24 }: CategoryIconProps) {
  const IconComponent = categoryIconMap[title]

  if (!IconComponent) {
    return (
      <div className={cn("w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center", className)}>
        <span className="text-lg">🍽️</span>
      </div>
    )
  }

  return <IconComponent size={size} className={className} />
}