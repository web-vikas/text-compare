import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Text Comapre Tool',
  description: 'Created By Vikas Patel | https://in-vikas.vercel.app/',
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
