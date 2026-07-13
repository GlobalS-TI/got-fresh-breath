export const metadata = {
  title: 'Instalación — Got Fresh Breath',
}

const PASOS = [
  {
    titulo: '1. Colocación',
    texto:
      'Recomendamos montar el dispensador lo más alto posible cerca del lavabo del baño, sin dejar de cumplir las directrices de la ubicación.',
  },
  {
    titulo: '2. Montaje',
    texto:
      'Retire el soporte de montaje de la parte posterior del dispensador y marque en la pared la ubicación de los tornillos suministrados. Cuando se monte sobre azulejos, sólo es necesario utilizar dos tornillos en la junta entre los azulejos. Para otras superficies, utilice los cuatro tornillos de montaje. Pre taladre un agujero e inserte los tacos de plástico. Las almohadillas adhesivas incluidas son sólo para uso temporal durante la instalación — es necesario montar la unidad con tornillos para evitar que se caiga de la pared y se dañe.',
  },
  {
    titulo: '3. Tornillo de fijación',
    texto:
      'Deslice el dispensador sobre el soporte de montaje. Utilice el tornillo de fijación, el más pequeño incluido, para fijar el dispensador en su sitio. Colóquelo en el interior del dispensador, en el orificio situado a unos cinco centímetros por encima de la válvula, cerca del centro del dispensador de vasos. Esto evita que la unidad se salga o se golpee contra la pared.',
  },
  {
    titulo: '4. Vasos',
    texto: 'Saque un paquete de vasos de su embalaje e introdúzcalo en la parte superior del dispensador de vasos.',
  },
  {
    titulo: '5. Enjuague bucal',
    texto:
      'Retire el tapón de la botella de enjuague bucal para dejar al descubierto el precinto. Dé la vuelta a la botella con cuidado y empújela firmemente sobre la válvula del dispensador de enjuague bucal.',
  },
  {
    titulo: '6. Mantenimiento',
    texto: 'Recomendamos limpiar el dispensador regularmente con un limpiador estándar y secarlo con una toalla limpia.',
  },
]

export default function InstalacionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold text-slate-900">Instalación</h1>
      <div className="flex flex-col gap-8">
        {PASOS.map((paso) => (
          <div key={paso.titulo}>
            <h2 className="mb-2 text-lg font-semibold text-brand-700">{paso.titulo}</h2>
            <p className="text-slate-700">{paso.texto}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
