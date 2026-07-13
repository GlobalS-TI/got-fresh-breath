import { LeadForm } from '@/components/LeadForm'

export const metadata = {
  title: 'Contacto — Got Fresh Breath',
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold text-slate-900">Contacto</h1>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-brand-700">Línea Directa Corporativa</h2>
          <p className="mb-6 text-slate-700">(81) 1680 9833</p>

          <h2 className="mb-2 text-lg font-semibold text-brand-700">Consultoría Institucional</h2>
          <p className="mb-6 text-slate-700">contacto@gotfreshbreath.mx</p>

          <h2 className="mb-2 text-lg font-semibold text-brand-700">Atención Corporativa</h2>
          <p className="text-slate-700">Lunes a Viernes – 8:30 am a 5:30 pm</p>
          <p className="mb-6 text-slate-700">Torreón 514, Chapultepec, 66450, San Nicolás de los Garza, N.L.</p>

          <div className="flex h-40 items-center justify-center rounded bg-slate-100 text-sm text-slate-400">
            Mapa — pendiente URL de Google Maps
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-900">Envíanos tu mensaje</h2>
          <LeadForm tipo="contacto" />
        </div>
      </div>
    </div>
  )
}
