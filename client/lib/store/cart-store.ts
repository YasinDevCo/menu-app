import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/types'

export interface CartItem {
  menuItem: Product
  quantity: number
  note?: string  // ← اضافه کردن note به صورت optional
}

interface CartStore {
  items: CartItem[]
  tableNumber: string | null
  addItem: (product: Product, note?: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setTableNumber: (table: string) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,

      addItem: (product, note) => {
        const { items } = get()
        const existingItem = items.find((item) => item.menuItem._id === product._id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.menuItem._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({ items: [...items, { menuItem: product, quantity: 1, note }] })
        }
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          set({ items: items.filter((item) => item.menuItem._id !== productId) })
        } else {
          set({
            items: items.map((item) =>
              item.menuItem._id === productId ? { ...item, quantity } : item
            ),
          })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.menuItem._id !== productId) })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.menuItem?.price || 0) * item.quantity,
          0
        )
      },

      setTableNumber: (table) => set({ tableNumber: table }),
    }),
    {
      name: 'cart-storage',
    }
  )
)