'use client'

import { useRef, useState } from 'react'

import { Check } from 'lucide-react'

import { LeadForm } from '@/components/LeadForm'
import { MediaSlot } from '@/components/MediaSlot'
import type { Media } from '@/payload-types'

const SECTORES = [
  { value: 'hoteles', label: 'Hoteles & Resorts', desc: 'Amenities premium para hoteles y resorts. Protege la experiencia de tus huéspedes en áreas comunes, spas y restaurantes.' },
  { value: 'restaurantes', label: 'Restaurantes', desc: 'El toque final de sofisticación para tus clientes y la regla de oro para tu personal de servicio.' },
  { value: 'corporativos', label: 'Empresarial y Corporativos', desc: 'Higiene bucal para oficinas corporativas y espacios de coworking. Cultura de imagen profesional e interacciones impecables en salas de juntas.' },
  { value: 'salud', label: 'Salud', desc: 'Entornos de confianza absoluta. El beneficio de cortesía que complementa el cuidado de tus especialistas.' },
  { value: 'comercial', label: 'Comercial', desc: 'Transforma los sanitarios de tu plaza o centro comercial en una extensión de tu experiencia premium.' },
  { value: 'hogar', label: 'Hogar', desc: 'Lleva a tus espacios residenciales un sistema automatizado de frescura premium.' },
]

type SectoresClientProps = {
  sectoresMedia: Record<string, Media | null>
}

export function SectoresClient({ sectoresMedia }: SectoresClientProps) {
  const [selectedSectores, setSelectedSectores] = useState<string[]>([])
  const pickerRef = useRef<HTMLDivElement>(null)

  function toggleSector(value: string) {
    setSelectedSectores((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  function scrollToPicker() {
    pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Diseñemos el programa
          <br />
          de tu empresa
        </h2>
        <button
          type="button"
          onClick={scrollToPicker}
          className="rounded-md bg-white/15 px-6 py-2 font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/25"
        >
          Iniciar
        </button>
      </div>

      <div ref={pickerRef} className="mt-16 scroll-mt-16">
        <h3 className="mb-2 text-center text-xl font-bold text-white">
          Antes de empezar, ¿qué espacio vamos a transformar?
        </h3>
        <p className="mb-10 text-center text-sm text-white/85">
          Selecciona tu sector (puedes elegir más de uno) para personalizar tu propuesta automáticamente.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORES.map((sector) => {
            const checked = selectedSectores.includes(sector.value)
            return (
              <button
                key={sector.value}
                type="button"
                onClick={() => toggleSector(sector.value)}
                aria-pressed={checked}
                className={`relative overflow-hidden rounded-md border-2 bg-white text-left transition ${
                  checked ? 'border-white' : 'border-transparent'
                }`}
              >
                <MediaSlot
                  media={sectoresMedia[sector.value] ?? null}
                  fallbackLabel={`Foto - ${sector.label} (pendiente del cliente)`}
                  className="flex h-32 items-center justify-center border border-dashed border-slate-300 bg-slate-100 px-3 text-center text-xs text-slate-400"
                  mediaClassName="h-32 w-full object-cover"
                />
                {checked && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                <div className="px-3 py-3">
                  <h4 className="font-bold text-slate-900">{sector.label}</h4>
                  <p className="mt-1 text-xs text-slate-600">{sector.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-sm text-white/85">
          Al dar clic en cualquiera, la página activa automáticamente los campos del formulario de abajo
          para que haga sentido con su operación.
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-white/30 bg-white p-6 md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Equipa tu empresa hoy</h2>
          <LeadForm tipo="sectores" sectoresSeleccionados={selectedSectores} />
        </div>
      </div>
    </>
  )
}
