import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'
import { Category, ApiResponse } from '@/lib/types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories')
      return data.data || []
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newCategory: { title: string; priority?: number; icon?: string }) => {
      const { data } = await api.post<ApiResponse<Category>>('/categories', newCategory)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('دسته‌بندی با موفقیت ایجاد شد')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'خطا در ایجاد دسته‌بندی')
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
      const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('دسته‌بندی با موفقیت ویرایش شد')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'خطا در ویرایش دسته‌بندی')
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('دسته‌بندی با موفقیت حذف شد')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'خطا در حذف دسته‌بندی')
    },
  })
}