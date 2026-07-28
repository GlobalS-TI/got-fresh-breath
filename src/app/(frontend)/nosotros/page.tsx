import { ClientesDestacados } from '@/components/ClientesDestacados'
import { NosotrosHero } from '@/components/NosotrosHero'
import { ProgramaIntegral } from '@/components/ProgramaIntegral'

export const metadata = {
  title: 'Nosotros — Got Fresh Breath',
}

export default function NosotrosPage() {
  return (
    <>
      <NosotrosHero />

      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <p className="text-slate-800">
          Nacimos para resolver una distracción <strong className="font-bold">invisible pero real:</strong>
          <br />
          la seguridad de tu equipo al hablar, negociar y colaborar cara a cara.
        </p>
        <p className="mt-8 font-bold text-slate-900">Distribución Oficial en todo México y LATAM.</p>
        <p className="mt-1 text-slate-700">
          Operamos con logística y soporte directo para asegurar que tu programa nunca se detenga, sin
          importar cuántos puntos de uso requiera tu organización.
        </p>
      </div>

      <ProgramaIntegral />

      <ClientesDestacados />
    </>
  )
}
