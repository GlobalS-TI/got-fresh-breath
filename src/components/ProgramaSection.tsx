import Link from 'next/link'

const PASOS = [
  {
    numero: 1,
    label: 'Elige tu perfil',
    desc: 'Selecciona tu sector para alinear el programa a las necesidades de tu equipo.',
  },
  {
    numero: 2,
    label: 'Determina tu cobertura',
    desc: 'Calculamos el volumen y la cantidad de puntos de uso según tu número de colaboradores.',
  },
  {
    numero: 3,
    label: 'Operación Continua',
    desc: 'Olvídate de la logística. Escalamos tu servicio mensual con instalación, mantenimiento y autorefills incluidos.',
  },
]

export function ProgramaSection() {
  return (
    <>
      <section className="relative flex h-64 items-end overflow-hidden bg-slate-800 md:h-80">
        {/* Foto - colaboradores en oficina (pendiente del cliente) */}
        <div className="absolute inset-0 flex items-center justify-center border border-dashed border-white/20 text-sm text-white/40">
          Foto - colaboradores en oficina (pendiente del cliente)
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Conoce tu
            <br />
            Programa
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
            Configura el estándar de higiene y presentación que mejor se adapte a tu operación
            diaria para asegurar la confianza total de tus colaboradores.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-brand-400 to-brand-600 px-6 py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <h2 className="mb-10 text-2xl font-bold text-white">¿Cómo funciona?</h2>

          <ol className="relative flex flex-col gap-10">
            <div
              aria-hidden
              className="pointer-events-none absolute left-12 top-5 bottom-5 border-l border-dashed border-white/25"
            />

            {PASOS.map((paso) => (
              <li key={paso.numero} className="relative flex gap-4">
                <div className="z-10 flex w-24 shrink-0 flex-col items-center gap-2 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-base font-bold text-white ring-1 ring-white/30">
                    {paso.numero}
                  </span>
                  <span className="text-xs font-medium text-white/85">{paso.label}</span>
                </div>
                <div className="flex flex-1 items-center gap-4 pt-4">
                  <div className="h-px w-10 shrink-0 border-t border-dashed border-white/40" />
                  <p className="max-w-sm text-sm font-semibold leading-relaxed text-white">
                    {paso.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex justify-center">
            <Link
              href="#elige-tu-sector"
              className="rounded-md bg-slate-700/90 px-6 py-3 font-semibold text-white shadow-lg shadow-slate-900/20 transition-colors hover:bg-slate-800"
            >
              Elige el plan para tu empresa
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
