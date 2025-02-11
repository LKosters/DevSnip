import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevSnip',
  description: 'DevSnip is a platform for sharing code snippets with ease.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
