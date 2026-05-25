// ========== Business (رستوران) ==========
export interface Business {
  _id: string
  name: string
  ownerName: string
  phoneNumber: string
  slug: string
  logoUrl: string | null
  primaryColor: string
  isDark: boolean
}

// ========== Category (دسته‌بندی) - منطبق با سرور ==========
export interface Category {
  _id: string
  title: string
  titleEn?: string | null
  priority?: number
  isActive?: boolean
  businessId?: string
  icon?: string | null
  description?: string | null
}

// ========== Product (محصول) - منطبق با سرور ==========
export interface Product {
  _id: string
  name: string
  price: number
  discountPrice: number | null
  imageUrl: string | null
  description: string | null
  isAvailable: boolean
  preparationTime: number
  categoryId: string | { _id: string; title: string }
  businessId?: string
  salesCount?: number
  rating?: number
  priority?: number
  createdAt?: string
  updatedAt?: string
}

// ========== Menu Item (برای نمایش منو) ==========
export interface MenuItem {
  _id: string
  title: string
  products: Product[]
}

// ========== Cart Item ==========
export interface CartItem {
  product: Product
  quantity: number
  note?: string
}

// ========== Order ==========
export interface Order {
  _id: string
  tableNumber: number
  businessId: string
  items: OrderItem[]
  subtotal: number
  discountAmount: number
  taxAmount: number
  serviceFeeAmount: number
  totalAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED'
  payment: {
    method: 'CASH' | 'ONLINE' | 'POS'
    status: 'PENDING' | 'PAID' | 'FAILED'
  }
  createdAt: string
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  priceAtTime: number
  note?: string
  itemTotal: number
}

// ========== API Response ==========
export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  error?: {
    message: string
  }
}

// ========== Auth ==========
export interface AuthResponse {
  success: boolean
  token: string
  business: {
    id: string
    name: string
    slug: string
    phoneNumber: string
  }
}

// ========== Language (برای پشتیبانی بعدی) ==========
export type Language = 'fa' | 'en'

// ========== Theme Settings ==========
export interface ThemeSettings {
  primaryColor: string
  accentColor: string
  borderRadius: number
  restaurantName: string
  restaurantNameEn: string
  restaurantLogo: string
  serviceHours: {
    enabled: boolean
    openTime: string
    closeTime: string
    message: string
    messageEn: string
  }
  aboutUs: {
    content: string
    contentEn: string
  }
  pageVisibility: {
    menu: boolean
    cart: boolean
    aboutUs: boolean
    complaints: boolean
  }
}