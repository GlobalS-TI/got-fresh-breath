import { MediaSlot } from '@/components/MediaSlot'
import { getPayloadClient } from '@/lib/payload'
import { getSiteMediaSlot } from '@/lib/siteMedia'

const FEATURES = [
  {
    key: 'programa-integral.instalacion-estetica',
    titulo: 'Instalación estética de los equipos',
    placeholder: 'Dispensadores instalados en pared',
  },
  {
    key: 'programa-integral.mantenimiento',
    titulo: 'Mantenimiento permanente',
    placeholder: 'Dispensador en baño',
  },
  {
    key: 'programa-integral.reposicion-consumibles',
    titulo: 'Reposición automática de consumibles',
    placeholder: 'Enjuague bucal y vasos',
  },
  {
    key: 'programa-integral.operacion-continua',
    titulo: 'Operación continua y garantizada',
    placeholder: 'Equipo de logística en almacén',
  },
]

export async function ProgramaIntegral() {
  const payload = await getPayloadClient()
  const { docs: consumibles } = await payload.find({
    collection: 'products',
    where: { activo: { equals: true }, categoria: { equals: 'consumible' } },
    limit: 1,
  })
  const primeraImagen = consumibles[0]?.imagenes?.[0]?.imagen
  const consumibleImagenUrl = typeof primeraImagen === 'object' ? primeraImagen?.url : null

  const features = await Promise.all(
    FEATURES.map(async (feature) => ({ ...feature, media: await getSiteMediaSlot(feature.key) })),
  )

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-400 to-brand-500 px-6 py-16">
      <h2 className="mx-auto mb-12 max-w-3xl text-center text-2xl font-bold text-white">
        Un programa integral en 4 palabras:
      </h2>

      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        {features.map((feature, i) => {
          const reversed = i % 2 === 1
          const isConsumibles = feature.key === 'programa-integral.reposicion-consumibles'

          return (
            <div
              key={feature.titulo}
              className={`flex flex-col items-center gap-6 md:flex-row ${reversed ? 'md:flex-row-reverse' : ''}`}
            >
              <h3
                className={`flex-1 text-center text-xl font-bold text-white md:text-2xl ${
                  reversed ? 'md:text-right' : 'md:text-left'
                }`}
              >
                {feature.titulo}
              </h3>

              <div className="flex h-56 w-full max-w-md flex-1 items-center justify-center rounded-md border border-dashed border-white/30 bg-white/10 px-3 text-center text-xs text-white/60 md:h-72">
                {feature.media ? (
                  <MediaSlot
                    media={feature.media}
                    fallbackLabel={`Foto - ${feature.placeholder} (pendiente del cliente)`}
                    mediaClassName="h-full w-full object-contain"
                  />
                ) : isConsumibles && consumibleImagenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={consumibleImagenUrl}
                    alt={feature.placeholder}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  `Foto - ${feature.placeholder} (pendiente del cliente)`
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
