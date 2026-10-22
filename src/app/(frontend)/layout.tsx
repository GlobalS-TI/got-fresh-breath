import React from 'react'

import type { Metadata } from 'next'

import WhatsappButton from '@/components/WhatsappButton'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartProvider } from '@/lib/cart-context'
import { GoogleTagManagerHead, GoogleTagManagerBody } from '@/components/GoogleTagManager'
import { SITIO_NOMBRE, SITIO_URL, WHATSAPP_NUMERO } from '@/lib/sitio'
import './styles.css'

export const metadata: Metadata = {
  // Base para resolver canonical, og:url y og:image relativos (ver `metadatosDePagina`).
  metadataBase: new URL(SITIO_URL),
  description:
    'Dispensadores automáticos de enjuague bucal en comodato para hoteles, oficinas corporativas y espacios de coworking. Instalación, mantenimiento y consumibles incluidos.',
  title: SITIO_NOMBRE,
}

const ORGANIZACION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITIO_URL}/#organizacion`,
  name: SITIO_NOMBRE,
  url: SITIO_URL,
  logo: `${SITIO_URL}/logo.png`,
  email: 'ventas@gotfreshbreath.mx',
  telephone: `+${WHATSAPP_NUMERO}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Torreón 514, Chapultepec',
    addressLocality: 'San Nicolás de los Garza',
    addressRegion: 'N.L.',
    postalCode: '66450',
    addressCountry: 'MX',
  },
  areaServed: ['MX', 'LATAM'],
  sameAs: ['https://www.instagram.com/gotfreshbreath.mx'],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Global Supplier MTY, S.A. de C.V.',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es">
      <body className="text-slate-900 flex min-h-screen flex-col">
        <GoogleTagManagerHead />
        <GoogleTagManagerBody />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZACION_JSON_LD) }}
        />
        <CartProvider>
          <Navbar />
          <main className="pt-16 flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <WhatsappButton />
      </body>
    </html>
  )
}
