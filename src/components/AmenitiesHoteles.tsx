import { Check } from 'lucide-react'
import Link from 'next/link'

import { MediaSlot } from '@/components/MediaSlot'
import { getSiteMediaSlot } from '@/lib/siteMedia'

const INCLUIDOS = [
  'Kit de amenities completo: dispensador, vasos y enjuague bucal',
  'Sin costo inicial de equipo',
  'Instalación, mantenimiento y reposición de consumibles incluidos',
]

export async function AmenitiesHoteles() {
  const foto = await getSiteMediaSlot('amenities-hoteles.dispensador-hotel')

  return (
    <section
      id="amenities-hoteles"
      className="scroll-mt-16 overflow-hidden bg-linear-to-b from-brand-400 to-brand-600 px-6 py-16"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Amenities para Hoteles: Enjuague Bucal en Comodato
          </h2>
          <p className="mt-4 leading-relaxed text-white/85">
            Un dispensador bien presentado en spas, restaurantes y áreas comunes es parte de la
            experiencia premium que esperan tus huéspedes de un hotel de nivel.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {INCLUIDOS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-white">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-white/90" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="#elige-tu-sector"
            className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg shadow-brand-900/20 transition-colors hover:bg-brand-50"
          >
            Diseñar mi programa
          </Link>
        </div>

        <div className="relative h-64 overflow-hidden rounded-lg md:h-80">
          <MediaSlot
            media={foto}
            fallbackLabel="Foto - amenities de hotel (pendiente del cliente)"
            className="flex h-full items-center justify-center rounded-lg border border-dashed border-white/40 text-center text-sm text-white/70"
            mediaClassName="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
