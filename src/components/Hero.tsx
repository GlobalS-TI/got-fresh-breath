'use client'

import Link from 'next/link'
import { useRef } from 'react'

import { MediaSlot } from '@/components/MediaSlot'
import { gsap, useGSAP } from '@/lib/gsap'
import type { Media } from '@/payload-types'

type HeroProps = {
  productImage?: Media | null
}

export function Hero({ productImage = null }: HeroProps) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
          .from('.hero-line', { opacity: 0, y: 16 })
          .from('.hero-hook', { opacity: 0, y: 24 }, '-=0.45')
          .from('.hero-copy', { opacity: 0, y: 16 }, '-=0.45')
          .from('.hero-cta', { opacity: 0, y: 16 }, '-=0.4')
          .from('.hero-visual', { opacity: 0, scale: 0.96 }, '-=0.55')
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      className="relative -mt-16 overflow-hidden bg-gradient-to-b from-brand-300 to-brand-500 px-6 pb-20 pt-20 md:pb-24 md:pt-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[6fr_7fr]">
        <div className="relative z-10">
          <h1 className="text-white">
            <span className="hero-line block text-2xl font-medium text-white/75 md:text-3xl">
              Tu reputación se mide
            </span>
            <span className="hero-hook mt-1 block text-4xl font-extrabold leading-[1.05] md:text-6xl">
              a centímetros de distancia.
            </span>
          </h1>
          <p className="hero-copy mt-6 max-w-md text-lg text-white/90">
            Protege la experiencia de tus comensales y clientes con un servicio automatizado todo
            incluido.
          </p>
          <Link
            href="/comodato"
            className="hero-cta mt-8 inline-block rounded-md bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg shadow-brand-900/20 transition-colors hover:bg-brand-50"
          >
            Solicitar Estación en Comodato
          </Link>
        </div>

        <div className="hero-visual relative h-48 overflow-hidden rounded-lg md:h-[26rem]">
          <MediaSlot
            media={productImage}
            fallbackLabel="Imágenes de producto - pendientes del cliente"
            className="flex h-full items-center justify-center rounded-lg border border-dashed border-white/40 text-center text-sm text-white/70"
            mediaClassName="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
