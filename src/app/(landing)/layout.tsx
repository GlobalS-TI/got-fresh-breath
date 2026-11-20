import React from 'react'

import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { GoogleTagManagerHead, GoogleTagManagerBody } from '@/components/GoogleTagManager'
import { SITIO_URL } from '@/lib/sitio'
import './landing.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
}

// Root layout para landings de campaña (p. ej. /consultorios): traen su propio header/footer
// y diseño, así que no usan el Navbar/Footer/Tailwind de (frontend). Las fuentes se sirven
// desde el propio dominio vía next/font — el CSP del frontend no permite Google Fonts directo.
//
// Se usan archivos locales (subset latin, fuentes variables descargadas de Google Fonts) en vez de
// next/font/google: Google a veces responde con URLs sin extensión (/l/font?kit=…) que Turbopack
// no sabe resolver y tumban el build de forma intermitente (vercel/next.js#99114).
const bricolage = localFont({
  src: [{ path: './fonts/BricolageGrotesque-latin.woff2', weight: '600 800', style: 'normal' }],
  variable: '--font-bricolage',
  display: 'swap',
})

const figtree = localFont({
  src: [{ path: './fonts/Figtree-latin.woff2', weight: '400 700', style: 'normal' }],
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
