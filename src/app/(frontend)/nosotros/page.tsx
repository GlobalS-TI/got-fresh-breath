import { ClientsWall } from '@/components/ClientsWall'

export const metadata = {
  title: 'Nosotros — Got Fresh Breath',
}

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-200 to-brand-500 px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl">Equipamos la cultura de tu empresa</h1>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-slate-700">
          Nacimos para resolver una distracción <strong>invisible pero real:</strong> la seguridad de tu
          equipo al hablar, negociar y colaborar cara a cara.
        </p>
        <p className="mt-4 font-semibold text-brand-700">Distribución Oficial en todo México y LATAM.</p>
        <p className="mt-2 text-slate-700">
          Operamos con logística y soporte directo para asegurar que tu programa nunca se detenga, sin
          importar cuántos puntos de uso requiera tu organización.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Un programa integral en 4 palabras</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {[
            'Instalación estética de los equipos',
            'Mantenimiento permanente',
            'Reposición automática de consumibles',
            'Operación continua y garantizada',
          ].map((item) => (
            <div key={item} className="rounded-lg bg-brand-50 p-6 font-semibold text-brand-800">
              {item}
            </div>
          ))}
        </div>
      </section>

      <ClientsWall />
    </>
  )
}
