import Link from 'next/link'

const SECTORES = [
  {
    label: 'Hoteles & Resorts',
    desc: 'Dispensadores decorativos para destinos internacionales. Protege la experiencia de tus huéspedes en áreas comunes, spas y restaurantes.',
    cta: 'Elevar Experiencia',
  },
  {
    label: 'Restaurantes',
    desc: 'El toque final de sofisticación para tus clientes y la regla de oro para tu personal de servicio.',
    cta: 'Equipar Equipo de Piso',
  },
  {
    label: 'Empresarial y Corporativos',
    desc: 'Cultura de imagen profesional. Seguridad personal e interacciones impecables en oficinas y salas de juntas.',
    cta: 'Elevar Bienestar Interno',
  },
  {
    label: 'Salud',
    desc: 'Entornos de confianza absoluta. El beneficio de cortesía que complementa el cuidado de tus especialistas.',
    cta: 'Respaldar Personal',
  },
  {
    label: 'Comercial',
    desc: 'Transforma los sanitarios de tu plaza o centro comercial en una extensión de tu experiencia premium.',
    cta: 'Equipar Personal de Atención',
  },
  {
    label: 'Hogar',
    desc: 'Lleva a tus espacios residenciales un sistema automatizado de frescura premium.',
    cta: 'Ver Línea Residencial',
  },
]

export function SectoresGrid() {
  return (
    <section>
      <h1 className="mb-10 text-center text-3xl font-bold text-slate-900">Sectores</h1>

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {SECTORES.map((sector) => (
          <div key={sector.label} className="flex flex-col">
            <div className="overflow-hidden rounded-md border border-slate-200">
              <div className="flex h-44 items-center justify-center border border-dashed border-slate-300 bg-slate-100 px-3 text-center text-xs text-slate-400">
                Foto - {sector.label} (pendiente del cliente)
              </div>
              <div className="px-4 py-3">
                <h3 className="font-bold text-slate-900">{sector.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{sector.desc}</p>
              </div>
            </div>

            <Link
              href="#elige-tu-sector"
              className="mt-3 inline-block w-fit rounded-md bg-slate-700/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              {sector.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
