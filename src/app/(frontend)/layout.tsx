import React from 'react'

import type { Metadata } from 'next'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/lib/cart-context'
import { GoogleTagManagerHead, GoogleTagManagerBody } from '@/components/GoogleTagManager'
import './styles.css'

export const metadata: Metadata = {
  description:
    'Dispensadores automáticos de enjuague bucal para hoteles, restaurantes y corporativos.',
  title: 'Got Fresh Breath',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body className="text-slate-900">
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <CartProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
