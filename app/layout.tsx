import type { Metadata } from 'next'
import { Geist, Geist_Mono, Merriweather, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _merriweather = Merriweather({ weight: ['400', '700'], subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Delta Car - Buy, Sell & Rent Vehicles',
  description: 'Premium vehicle marketplace for buying, selling, renting, and maintenance services',
  generator: 'v0.app',
}

import { Toaster } from '@/components/ui/sonner'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Footer } from '@/components/Footer'
import { Suspense } from 'react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background scroll-smooth">
      <body className={`${_geist.className} ${_playfair.variable} antialiased`} suppressHydrationWarning>
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        {children}
        <Footer />
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
