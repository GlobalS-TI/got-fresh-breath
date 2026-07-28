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
          {/* pt-16 compensa el nav (fixed, fuera del flujo) — el Hero de home la cancela con -mt-16
              para que su fondo llegue hasta arriba, detrás del nav transparente. */}
          <main className="pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
