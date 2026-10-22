import React from 'react'

import type { Metadata } from 'next'
import { Bricolage_Grotesque, Figtree } from 'next/font/google'

import { GoogleTagManagerHead, GoogleTagManagerBody } from '@/components/GoogleTagManager'
import { SITIO_URL } from '@/lib/sitio'
import './landing.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
}

// Root layout para landings de campaña (p. ej. /consultorios): traen su propio header/footer
// y diseño, así que no usan el Navbar/Footer/Tailwind de (frontend). Las fuentes se sirven
// desde el propio dominio vía next/font — el CSP del frontend no permite Google Fonts directo.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
})

export default function LandingLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    // data-scroll-behavior: Next desactiva el scroll suave durante navegaciones entre rutas para
    // que no se anime el salto al inicio de la página nueva.
    <html lang="es" className={`${bricolage.variable} ${figtree.variable}`} data-scroll-behavior="smooth">
      <body style={{ margin: 0, background: '#FFFFFF' }}>
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        {children}
      </body>
    </html>
  )
}
