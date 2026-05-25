import Providers from './providers'
import type { Metadata, Viewport } from 'next'
import '@fontsource/vazirmatn/400.css'
import '@fontsource/vazirmatn/500.css'
import '@fontsource/vazirmatn/700.css'
import '@fontsource/vazirmatn/900.css'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'رستوران | منوی دیجیتال',
  description: 'منوی دیجیتال رستوران - سفارش آنلاین غذا',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#722F37',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" className="bg-background">
      <body className="font-vazirmatn antialiased min-h-screen">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            richColors
            dir="rtl"
            toastOptions={{
              style: {
                fontFamily: 'Vazirmatn, sans-serif',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}