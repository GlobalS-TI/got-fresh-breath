import { Play } from 'lucide-react'

export const metadata = {
  title: 'Instalación — Got Fresh Breath',
}

const PASOS = [
  {
    titulo: '1- Colocación',
    texto:
      'Recomendamos montar el dispensador lo más alto posible cerca del lavabo del baño, sin dejar de cumplir las directrices de la ubicación.',
  },
  {
    titulo: '2- Montaje',
    texto:
      'Retire el soporte de montaje de la parte posterior del dispensador y marque en la pared la ubicación de los tornillos suministrados. Cuando se monte sobre azulejos, sólo es necesario utilizar dos tornillos en la junta entre los azulejos. Para otras superficies, utilice los cuatro tornillos de montaje. Pre taladre un agujero e inserte los tacos de plástico.\n\nLas almohadillas adhesivas incluidas son sólo para uso temporal durante la instalación. Es necesario montar la unidad con tornillos para evitar que se caiga de la pared y se dañe.',
  },
  {
    titulo: '3- Tornillo de fijación',
    texto:
      'Deslice el dispensador sobre el soporte de montaje. Utilice el tornillo de fijación, el más pequeño incluido, para fijar el dispensador en su sitio.\n\nColoque este tornillo en el interior del dispensador, en el orificio situado a unos cinco centímetros por encima de la válvula, cerca del centro del dispensador de vasos.\n\nEsto evita que la unidad se salga o se golpee contra la pared.',
  },
  {
    titulo: '4- Vasos',
    texto: 'Saque un paquete de vasos de su embalaje e introdúzcalo en la parte superior del dispensador de vasos.',
  },
  {
    titulo: '5- Enjuague bucal',
    texto:
      'Retire el tapón de la botella de enjuague bucal para dejar al descubierto el precinto. Dé la vuelta a la botella con cuidado y empújela firmemente sobre la válvula del dispensador de enjuague bucal.',
  },
  {
    titulo: '6- Mantenimiento',
    texto: 'Recomendamos limpiar el dispensador regularmente con un limpiador estándar y secarlo con una toalla limpia.',
  },
]

export default function InstalacionPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="sr-only">Instalación</h1>
        <div className="flex aspect-video items-center justify-center gap-3 rounded-md border border-dashed border-slate-300 bg-slate-100 text-slate-400">
          <Play className="h-6 w-6" />
          <span className="text-sm">Video de instalación (pendiente del cliente)</span>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-brand-400 to-brand-600 px-6 py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col gap-8">
          {PASOS.map((paso) => (
            <div key={paso.titulo}>
              <h2 className="mb-2 text-lg font-bold text-white">{paso.titulo}</h2>
              {paso.texto.split('\n\n').map((parrafo, i) => (
                <p key={i} className="mt-2 text-sm leading-relaxed text-white/90 first:mt-0">
                  {parrafo}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
