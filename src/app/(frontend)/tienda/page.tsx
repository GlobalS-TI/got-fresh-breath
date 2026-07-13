import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

export const metadata = {
  title: 'Tienda — Got Fresh Breath',
}

function formatPrecio(precio: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}

export default async function TiendaPage() {
  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { activo: { equals: true } },
    sort: 'nombre',
    limit: 100,
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold text-slate-900">Tienda</h1>

      {products.length === 0 ? (
        <p className="text-slate-600">Aún no hay productos disponibles.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const primeraImagen = product.imagenes?.[0]?.imagen
            const imagenUrl = typeof primeraImagen === 'object' ? primeraImagen?.url : null
            const fichaTecnica = typeof product.fichaTecnica === 'object' ? product.fichaTecnica : null

            return (
              <div key={product.id} className="flex flex-col rounded-lg border border-slate-200 p-4">
                <Link href={`/tienda/${product.slug}`} className="mb-3 block">
                  {imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagenUrl} alt={product.nombre} className="h-40 w-full object-contain" />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                      Imagen pendiente
                    </div>
                  )}
                </Link>
                <Link href={`/tienda/${product.slug}`} className="font-semibold text-slate-900 hover:text-brand-600">
                  {product.nombre}
                </Link>
                <p className="mt-1 font-bold text-brand-700">{formatPrecio(product.precio)}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled
                    title="Disponible próximamente"
                    className="cursor-not-allowed rounded-md border border-slate-300 py-2 text-sm text-slate-400"
                  >
                    Agregar al carrito
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Disponible próximamente"
                    className="cursor-not-allowed rounded-md bg-slate-200 py-2 text-sm text-slate-400"
                  >
                    Compra ahora
                  </button>
                  {fichaTecnica?.url && (
                    <a
                      href={fichaTecnica.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-slate-900 py-2 text-center text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      Ficha Técnica
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
