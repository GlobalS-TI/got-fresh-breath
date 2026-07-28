import { LeadForm } from '@/components/LeadForm'

export const metadata = {
  title: 'Estación en Comodato - Got Fresh Breath',
}

export default function ComodatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-4 text-center text-3xl font-bold text-slate-900">Solicitar Estación en Comodato</h1>
      <p className="mb-10 text-center text-slate-600">
        Protege la experiencia de tus comensales y clientes con un servicio automatizado todo incluido:
        instalación, mantenimiento y reposición de consumibles sin costo inicial de equipo.
      </p>

      <div className="mx-auto max-w-md rounded-lg border border-slate-200 p-6">
        <LeadForm tipo="comodato" />
      </div>
    </div>
  )
}
