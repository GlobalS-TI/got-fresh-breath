import { ClientsWall } from '@/components/ClientsWall'
import { CorporateReputation } from '@/components/CorporateReputation'
import { Hero } from '@/components/Hero'
import { ScrollReveal } from '@/components/ScrollReveal'

export default function HomePage() {
  return (
    <>
      <Hero />

      <ClientsWall />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold leading-snug text-brand-700 md:text-3xl">
          El estándar de las empresas que mejor cuidan a su talento.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-700">
          Corporativos, industrias y hoteles de nivel premium{' '}
          <span className="font-semibold text-brand-600">confían en nuestro modelo recurrente</span> para{' '}
          <span className="font-semibold text-brand-600">elevar la percepción de su marca</span> y
          transformar el bienestar diario de sus colaboradores.
        </p>
      </section>

      <section className="flex h-72 items-center justify-center bg-gradient-to-b from-brand-200 to-brand-500 text-center text-white/90">
        Video - el trato al cliente (pendiente del cliente)
      </section>

      <ScrollReveal />

      <CorporateReputation />
    </>
  )
}
