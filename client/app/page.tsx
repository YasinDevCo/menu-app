'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toPersianNumber } from '@/lib/utils/format'
import api from '@/lib/api/client'

function LandingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setTableNumber = useCartStore((state) => state.setTableNumber)
  const [table, setTable] = useState('')
  const [error, setError] = useState('')
  const [business, setBusiness] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // دریافت اطلاعات رستوران
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await api.get('/menu')
        if (response.data.business) {
          setBusiness(response.data.business)
          if (response.data.business.logoUrl) {
            setLogoUrl(`https://yas-bucket.s3.ir-thr-at1.arvanstorage.ir/logos%2F1780651060521-142109558.jpg?versionId=`)
          }
        }
      } catch (error) {
        console.error('Error fetching business:', error)
        setBusiness({ name: 'کافه یاسین' })
      } finally {
        setIsLoading(false)
      }
    }
    fetchBusiness()
  }, [])

  useEffect(() => {
    const tableParam = searchParams.get('table')
    if (tableParam) {
      setTableNumber(tableParam)
      router.push('/menu')
    }
  }, [searchParams, setTableNumber, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!table.trim()) {
      setError('لطفا شماره میز را وارد کنید')
      return
    }
    setTableNumber(table.trim())
    router.push('/menu')
  }

  // در حال بارگذاری
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 animate-pulse flex items-center justify-center mb-4">
          <span className="text-3xl">🍽️</span>
        </div>
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 pattern-bg">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* لوگو */}
        <div className="mb-8">
          <div className="w-30 h-30 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={business?.name || 'لوگو'}
                className="w-full h-full object-cover"
                style={{ width: '120px', height: '120px', borderRadius: '50%' }}
              />
            ) : (
              <span className="text-4xl">🍽️</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {business?.name || 'کافه یاسین'}
          </h1>
          <p className="text-muted-foreground">
            منوی دیجیتال - سفارش آسان و سریع
          </p>
        </div>

        {/* شماره میز */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block text-right">
              شماره میز خود را وارد کنید
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="مثال: ۳"
              value={table}
              onChange={(e) => {
                setTable(e.target.value)
                setError('')
              }}
              className="text-center text-lg h-12"
              dir="ltr"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full h-12 text-base font-bold">
            مشاهده منو
          </Button>
        </form>

        {/* فوتر */}
        <div className="mt-12 text-muted-foreground text-xs space-y-1">
          <p>برای سفارش کافیست QR Code روی میز را اسکن کنید</p>
          <p>یا شماره میز خود را وارد نمایید</p>
        </div>
      </div>
    </main>
  )
}

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">در حال بارگذاری...</div>
        </div>
      }
    >
      <LandingContent />
    </Suspense>
  )
}