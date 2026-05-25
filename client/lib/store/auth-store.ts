import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Business {
  id: string
  name: string
  slug: string
  phoneNumber: string
  ownerName?: string
  logoUrl?: string | null
  primaryColor?: string
  isDark?: boolean
}

interface AuthState {
  token: string | null
  business: Business | null
  isAuthenticated: boolean
  login: (token: string, business: Business) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      business: null,
      isAuthenticated: false,
      login: (token, business) => set({ token, business, isAuthenticated: true }),
      logout: () => set({ token: null, business: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)