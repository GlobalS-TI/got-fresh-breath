import Link from 'next/link'

import { ClientsWall } from '@/components/ClientsWall'

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-300 to-brand-500 px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Tu reputación se mide <span className="text-brand-900">a centímetros de distancia.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/90">
              Protege la experiencia de tus comensales y clientes con un servicio automatizado todo
              incluido.
            </p>
            <Link
              href="/comodato"
              className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-semibold text-brand-700 hover:bg-brand-50"
            >
              Solicitar Estación en Comodato
            </Link>
          </div>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-white/50 text-center text-white/80 md:h-80">
            Imágenes de producto — pendientes del cliente
          </div>
        </div>
      </section>

      <ClientsWall />

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-brand-700">
          El estándar de las empresas que mejor cuidan a su talento.
        </h2>
        <p className="mt-6 text-slate-700">
          Corporativos, industrias y hoteles de nivel premium confían en nuestro modelo recurrente para
          elevar la percepción de su marca y transformar el bienestar diario de sus colaboradores.
        </p>
      </section>

      <section className="flex h-72 items-center justify-center bg-gradient-to-b from-brand-200 to-brand-500 text-center text-white/90">
        Video — el trato al cliente (pendiente del cliente)
      </section>
    </>
  )
}
