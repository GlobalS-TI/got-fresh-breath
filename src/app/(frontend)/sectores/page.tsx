import { SectoresClient } from '@/components/SectoresClient'

export const metadata = {
  title: 'Sectores — Got Fresh Breath',
}

export default function SectoresPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
        Diseñemos el programa de tu empresa
      </h1>
      <p className="mb-10 text-center text-slate-600">
        Selecciona tu sector para personalizar tu propuesta automáticamente.
      </p>
      <SectoresClient />
    </div>
  )
}
