import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api/client'

interface WaiterCallData {
    tableNumber: number
    message?: string
}

export function useWaiterCall() {
    return useMutation({
        mutationFn: async (data: WaiterCallData) => {
            const response = await api.post('/waiter/call', data)
            return response.data
        },
        onSuccess: () => {
            toast.success('درخواست شما به گارسون ارسال شد')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error?.message || 'خطا در ارسال درخواست')
        },
    })
}