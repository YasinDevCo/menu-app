import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api/client'

export interface SalesStats {
  summary: {
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
  }
  topProducts: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  chartData: Array<{
    date: string
    revenue: number
    count: number
  }>
  period: string
}

export interface DashboardStats {
  todayRevenue: number
  todayOrders: number
  pendingOrders: number
  revenueChange: number
}

export function useSalesStats(period: string = 'day') {
  return useQuery({
    queryKey: ['sales-stats', period],
    queryFn: async () => {
      const { data } = await api.get(`/stats/sales?period=${period}`)
      return data.data as SalesStats
    },
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/stats/dashboard')
      return data.data as DashboardStats
    },
    refetchInterval: 30000, // هر 30 ثانیه رفرش شود
  })
}