import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

export interface CreateOrderData {
  businessSlug?: string
  tableNumber: number
  items: Array<{
    productId: string
    quantity: number
    note?: string
  }>
  customer?: {
    name?: string
    phoneNumber?: string
  }
  note?: string
  payment?: {
    method: 'CASH' | 'ONLINE' | 'POS'
  }
}

export interface Order {
  _id: string
  tableNumber: number
  businessId: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    priceAtTime: number
    note?: string
    itemTotal: number
  }>
  subtotal: number
  taxAmount: number
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED' | 'COMPLETED'
  payment: {
    method: string
    status: string
  }
  customer?: {
    name?: string
    phoneNumber?: string
  }
  callWaiter?: {
    isActive: boolean
    message?: string
    calledAt?: Date
  }
  note?: string
  createdAt: string
}

// دریافت همه سفارشات
export function useOrders(status?: string) {
  const url = status ? `/orders?status=${status}` : '/orders'

  return useQuery({
    queryKey: ['orders', status],
    queryFn: async () => {
      const { data } = await api.get(url)
      return data.data as Order[]
    },
    refetchInterval: 30000,
  })
}

// دریافت یک سفارش
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`)
      return data.data as Order
    },
    enabled: !!id,
  })
}

// ایجاد سفارش جدید
export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const { data } = await api.post('/orders', orderData)
      return data.data as Order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('سفارش با موفقیت ثبت شد')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || error.response?.data?.message || 'خطا در ثبت سفارش'
      toast.error(message)
    },
  })
}

// تغییر وضعیت سفارش
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data } = await api.patch(`/orders/${id}/status`, { status })
      return data.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      toast.success('وضعیت سفارش تغییر کرد')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'خطا در تغییر وضعیت')
    },
  })
}

// فراخوان گارسون
export function useCallWaiter() {
  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message?: string }) => {
      const { data } = await api.post(`/orders/${id}/call-waiter`, { message })
      return data
    },
    onSuccess: () => {
      toast.success('درخواست شما به گارسون ارسال شد')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'خطا در ارسال درخواست')
    },
  })
}