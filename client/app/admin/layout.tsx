import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'پنل مدیریت | رستوران',
  description: 'پنل مدیریت رستوران',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
