import type { CartItem } from '@/lib/types'
import { formatPrice, toPersianNumber, getPersianTime } from './format'

interface TelegramMessage {
  tableNumber: string
  items: CartItem[]
  totalPrice: number
  note?: string
}

// Format order for Telegram with beautiful Persian formatting
export function formatTelegramMessage(order: TelegramMessage): string {
  const itemsText = order.items
    .map((item) => {
      // استخراج categoryId از product (چون در CartItem، product وجود دارد)
      const categoryId = typeof item.product.categoryId === 'string' 
        ? item.product.categoryId 
        : item.product.categoryId?._id || ''
      const emoji = getCategoryEmoji(categoryId)
      return `${emoji} ${item.product.name} × ${toPersianNumber(item.quantity)}`
    })
    .join('\n')

  let message = `🍽️ سفارش جدید
━━━━━━━━━━━━━━
📍 میز: ${toPersianNumber(order.tableNumber)}

${itemsText}

💰 مجموع: ${formatPrice(order.totalPrice)}`

  if (order.note && order.note.trim()) {
    message += `\n\n📝 یادداشت: ${order.note}`
  }

  message += `\n━━━━━━━━━━━━━━
⏰ ${getPersianTime()}`

  return message
}

// Get emoji based on category
function getCategoryEmoji(categoryId: string): string {
  const emojiMap: Record<string, string> = {
    'main-dishes': '🥘',
    'appetizers': '🥗',
    'beverages': '🥤',
    'desserts': '🍰',
    'kebabs': '🍢',
    'rice': '🍚',
    'stews': '🍲',
  }
  return emojiMap[categoryId] || '🍴'
}

// Send message to Telegram
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured')
    return false
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    const result = await response.json()
    return result.ok
  } catch (error) {
    console.error('Failed to send Telegram message:', error)
    return false
  }
}