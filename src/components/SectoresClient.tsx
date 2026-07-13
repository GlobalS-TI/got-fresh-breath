'use client'

import { useState } from 'react'

import { LeadForm } from '@/components/LeadForm'

const SECTORES = [
  { value: 'hoteles', label: 'Hoteles & Resorts', desc: 'Protege la experiencia de tus huéspedes en áreas comunes, spas y restaurantes.' },
  { value: 'restaurantes', label: 'Restaurantes', desc: 'El toque final de sofisticación para tus clientes y la regla de oro para tu personal de servicio.' },
  { value: 'corporativos', label: 'Empresarial y Corporativos', desc: 'Cultura de imagen profesional. Seguridad personal e interacciones impecables en oficinas y salas de juntas.' },
  { value: 'salud', label: 'Salud', desc: 'Entornos de confianza absoluta. El beneficio de cortesía que complementa el cuidado de tus especialistas.' },
  { value: 'comercial', label: 'Comercial', desc: 'Transforma los sanitarios de tu plaza o centro comercial en una extensión de tu experiencia premium.' },
  { value: 'hogar', label: 'Hogar', desc: 'Lleva a tus espacios residenciales un sistema automatizado de frescura premium.' },
]

export function SectoresClient() {
  const [selectedSector, setSelectedSector] = useState<string | undefined>(undefined)

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SECTORES.map((sector) => (
          <button
            key={sector.value}
            type="button"
            onClick={() => setSelectedSector(sector.value)}
            className={`rounded-lg border p-4 text-left transition ${
              selectedSector === sector.value
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 hover:border-brand-300'
            }`}
          >
            <h3 className="font-semibold text-slate-900">{sector.label}</h3>
            <p className="mt-2 text-sm text-slate-600">{sector.desc}</p>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-md rounded-lg border border-slate-200 p-6">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Equipa tu empresa hoy</h2>
        <LeadForm key={selectedSector} tipo="sectores" sectorPreseleccionado={selectedSector} />
      </div>
    </>
  )
}
