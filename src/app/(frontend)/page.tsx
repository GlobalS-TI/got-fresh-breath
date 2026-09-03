import type { Metadata } from 'next'

import { ClientsWall } from '@/components/ClientsWall'
import { CorporateReputation } from '@/components/CorporateReputation'
import { Hero } from '@/components/Hero'
import { MediaSlot } from '@/components/MediaSlot'
import { ScrollReveal } from '@/components/ScrollReveal'
import { getSiteMediaSlot } from '@/lib/siteMedia'

export const metadata: Metadata = {
  title: 'Got Fresh Breath | Dispensadores de Enjuague Bucal en Comodato',
  description:
    'Servicio todo incluido de dispensadores automáticos de enjuague bucal en comodato para hoteles, oficinas corporativas y coworking. Instalación, mantenimiento y reposición de consumibles sin costo inicial de equipo.',
}

export default async function HomePage() {
  const [heroVideo, heroProductImage] = await Promise.all([
    getSiteMediaSlot('home.hero-trato-cliente'),
    getSiteMediaSlot('home.hero-imagenes-producto'),
  ])

  return (
    <>
      <Hero productImage={heroProductImage} />

      <ClientsWall />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold leading-snug text-brand-700 md:text-3xl">
          El estándar de las empresas que mejor cuidan a su talento.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-700">
          Hoteles, oficinas corporativas y espacios de coworking de nivel premium{' '}
          <span className="font-semibold text-brand-600">confían en nuestro modelo recurrente</span>{' '}
          para{' '}
          <span className="font-semibold text-brand-600">elevar la percepción de su marca</span> y
          transformar el bienestar diario de sus colaboradores.
        </p>
      </section>

      <section className="relative flex h-72 items-center justify-center overflow-hidden bg-linear-to-b from-brand-200 to-brand-500 text-center text-white/90">
        <MediaSlot
          media={heroVideo}
          fallbackLabel="Video - el trato al cliente (pendiente del cliente)"
          mediaClassName="absolute inset-0 h-full w-full object-cover"
        />
      </section>

      <ScrollReveal />

      <CorporateReputation />
    </>
  )
}
