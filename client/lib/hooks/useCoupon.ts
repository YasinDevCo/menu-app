import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

export interface Coupon {
    _id: string
    code: string
    type: 'PERCENTAGE' | 'FIXED'
    value: number
    minOrderAmount: number
    maxDiscountAmount: number | null
    usageLimit: number
    usedCount: number
    validUntil: string  // ← string باشد
    isActive: boolean
}

export interface ValidateCouponResponse {
    coupon: {
        id: string
        code: string
        type: string
        value: number
        discountAmount: number
    }
}

// دریافت لیست کوپن‌ها
export function useCoupons() {
    return useQuery({
        queryKey: ['coupons'],
        queryFn: async () => {
            const { data } = await api.get('/coupons')
            return data.data as Coupon[]
        },
    })
}

// اعتبارسنجی کوپن
export function useValidateCoupon() {
    return useMutation({
        mutationFn: async ({ code, orderAmount }: { code: string; orderAmount: number }) => {
            const { data } = await api.post('/coupons/validate', { code, orderAmount })
            return data.data as ValidateCouponResponse
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'کد تخفیف نامعتبر است')
        },
    })
}

// استفاده از کوپن (افزایش count)
export function useUseCoupon() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (couponId: string) => {
            const { data } = await api.post('/coupons/use', { couponId })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
        },
    })
}

// ایجاد کوپن
export function useCreateCoupon() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (couponData: Partial<Coupon> & { validUntil: string }) => {  // ← validUntil حتماً string
            const { data } = await api.post('/coupons', couponData)
            return data.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
            toast.success('کوپن با موفقیت ایجاد شد')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'خطا در ایجاد کوپن')
        },
    })
}

// حذف کوپن
export function useDeleteCoupon() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/coupons/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coupons'] })
            toast.success('کوپن با موفقیت حذف شد')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'خطا در حذف کوپن')
        },
    })
}