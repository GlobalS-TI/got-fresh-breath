import Link from 'next/link'

export function CorporateReputation() {
  return (
    <section className="relative h-[32rem] overflow-hidden bg-slate-800 md:h-[36rem]">
      {/* Placeholder de foto — pendiente del cliente (personal en recepción) */}
      <div className="absolute inset-0 flex items-center justify-center border border-dashed border-white/20 text-sm text-white/40">
        Foto — personal en recepción (pendiente del cliente)
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end gap-4 px-6 pb-12 md:justify-center md:pb-0">
        <h2 className="max-w-md text-2xl font-bold leading-snug text-white md:text-3xl">
          Tu reputación corporativa se mide en las distancias cortas.
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-white/80">
          Got Fresh Breath transforma los sanitarios de tus colaboradores y visitas en un estándar de
          presentación impecable. Les damos la seguridad total para interactuar, hablar y reunirse con
          confianza absoluta.
        </p>
        <Link
          href="/sectores"
          className="mt-2 inline-block w-fit rounded-md bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Ver Beneficios Premium
        </Link>
      </div>
    </section>
  )
}
