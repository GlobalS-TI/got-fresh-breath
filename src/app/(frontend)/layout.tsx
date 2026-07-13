import React from 'react'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
