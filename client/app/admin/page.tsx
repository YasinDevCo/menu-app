'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Lock, Phone } from 'lucide-react'
import { useLogin } from '@/lib/hooks/useAuth'

export default function AdminLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneNumber.trim() || !password.trim()) {
      toast.error('لطفا شماره موبایل و رمز عبور را وارد کنید')
      return
    }

    login.mutate({ phoneNumber, password })
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" dir="rtl">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          پنل مدیریت
        </h1>
        <p className="text-muted-foreground mb-8">
          با شماره موبایل و رمز عبور وارد شوید
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="شماره موبایل"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pr-10 h-12"
              dir="ltr"
            />
          </div>

          <Input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
          />

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full h-12"
          >
            {login.isPending ? 'در حال ورود...' : 'ورود'}
          </Button>
        </form>
      </div>
    </main>
  )
}