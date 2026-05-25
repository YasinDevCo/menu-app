import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import type { Product } from '@/lib/types'  // ← استفاده از تایپ types.ts

export function useProducts(categoryId?: string) {
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products'

    return useQuery({
        queryKey: ['products', categoryId],
        queryFn: async () => {
            const { data } = await api.get(url)
            return data.data as Product[]
        },
    })
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const { data } = await api.get(`/products/${id}`)
            return data.data as Product
        },
        enabled: !!id,
    })
}

export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await api.post('/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return data.data as Product
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success('محصول با موفقیت ایجاد شد')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'خطا در ایجاد محصول')
        },
    })
}

export function useUpdateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
            const { data } = await api.put(`/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return data.data as Product
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
            toast.success('محصول با موفقیت ویرایش شد')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'خطا در ویرایش محصول')
        },
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/products/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success('محصول با موفقیت حذف شد')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'خطا در حذف محصول')
        },
    })
}

export function useToggleProductAvailability() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(`/products/${id}/toggle`)
            return data.data as Product
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            queryClient.invalidateQueries({ queryKey: ['product', id] })
            toast.success('وضعیت موجودی تغییر کرد')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'خطا در تغییر وضعیت')
        },
    })
}