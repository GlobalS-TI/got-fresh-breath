import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

export async function SolucionesGrid() {
  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { activo: { equals: true } },
    sort: 'nombre',
    limit: 4,
  })

  if (products.length === 0) return null

  return (
    <section className="mt-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">Nuestras Soluciones</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const primeraImagen = product.imagenes?.[0]?.imagen
          const imagenUrl = typeof primeraImagen === 'object' ? primeraImagen?.url : null

          return (
            <div key={product.id} className="flex flex-col">
              <div className="flex h-48 items-center justify-center rounded-lg bg-slate-100 p-6">
                {imagenUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagenUrl} alt={product.nombre} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400">Imagen pendiente</span>
                )}
              </div>
              <p className="mt-3 text-center font-bold text-slate-900">{product.nombre}</p>
              <Link
                href={`/tienda/${product.slug}`}
                className="mt-3 rounded-md bg-slate-700/90 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Comprar
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
