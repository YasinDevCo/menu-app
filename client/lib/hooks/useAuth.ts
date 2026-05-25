import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/auth-store'
import { AuthResponse } from '@/lib/types'

interface LoginData {
  phoneNumber: string
  password: string
}

interface RegisterData {
  name: string
  ownerName: string
  phoneNumber: string
  password: string
  slug: string
}

export function useLogin() {
  const router = useRouter()
  const loginStore = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>('/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success && data.token && data.business) {
        loginStore(data.token, data.business)
        toast.success('ورود موفق')
        router.push('/admin/dashboard')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'خطا در ورود')
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const loginStore = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<AuthResponse>('/auth/register', data)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success && data.token && data.business) {
        loginStore(data.token, data.business)
        toast.success('ثبت‌نام موفق')
        router.push('/admin/dashboard')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'خطا در ثبت‌نام')
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const logoutStore = useAuthStore((state) => state.logout)

  return () => {
    logoutStore()
    router.push('/admin')
    toast.success('خارج شدید')
  }
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/auth/profile')
      return data.data
    },
    enabled: false, // فقط وقتی صدا زده شود اجرا شود
  })
}