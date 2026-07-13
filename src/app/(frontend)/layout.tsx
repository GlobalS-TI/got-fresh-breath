import React from 'react'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/lib/cart-context'
import './styles.css'

export const metadata = {
  description: 'Dispensadores automáticos de enjuague bucal para hoteles, restaurantes y corporativos.',
  title: 'Got Fresh Breath',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body className="text-slate-900">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
