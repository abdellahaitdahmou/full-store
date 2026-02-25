import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'COD Store - Dof3 3nd Tawsil',
  description: 'Premium Moroccan eCommerce Store with Cash on Delivery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col bg-background text-foreground`}>
        {/* We selectively render Header/Footer based on route.
            For simplicity, since /admin has its own layout, the root layout wraps all.
            We will make Header/Footer conditional clientside or just ignore /admin routes in those components. */}
        <Header />
        <main className="flex-1 flex flex-col pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
