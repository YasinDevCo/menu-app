import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api/client'

export interface MenuResponse {
    success: boolean
    business: {
        name: string
        slug: string
        logoUrl: string | null
        primaryColor: string
    }
    menu: Array<{
        _id: string
        title: string
        products: Array<{
            _id: string
            name: string
            price: number
            discountPrice: number | null
            imageUrl: string | null
            description: string | null
            isAvailable: boolean
            preparationTime: number
        }>
    }>
}

export function useMenu() {
    return useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const { data } = await api.get<MenuResponse>(`/menu`)
            return data
        }
    })
}