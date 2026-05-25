// Format price to Persian with Toman
export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR') + ' تومان'
}

// Convert English numbers to Persian
export function toPersianNumber(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)])
}

// Get current Persian time
export function getPersianTime(): string {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return toPersianNumber(`${hours}:${minutes}`)
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
