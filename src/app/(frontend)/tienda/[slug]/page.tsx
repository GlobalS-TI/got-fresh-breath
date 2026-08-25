import { notFound } from 'next/navigation'

import { AddToCartButtons } from '@/components/AddToCartButtons'
import { getPayloadClient } from '@/lib/payload'

function formatPrecio(precio: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, activo: { equals: true } },
    limit: 1,
  })

  const product = docs[0]
  if (!product) {
    notFound()
  }

  const imagenes = product.imagenes ?? []
  const fichaTecnica = typeof product.fichaTecnica === 'object' ? product.fichaTecnica : null
  const primeraImagen = imagenes[0]?.imagen
  const imagenUrl = typeof primeraImagen === 'object' ? primeraImagen?.url : null

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          {imagenes.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {imagenes.map((entry) => {
                const imagen = typeof entry.imagen === 'object' ? entry.imagen : null
                return imagen?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={entry.id ?? imagen.id}
                    src={imagen.url}
                    alt={product.nombre}
                    className="h-40 md:h-80 w-full rounded object-contain"
                  />
                ) : null
              })}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded bg-slate-100 text-sm text-slate-400">
              Imagen pendiente
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">{product.nombre}</h1>
          <p className="mt-4 whitespace-pre-line text-slate-700">{product.descripcion}</p>
          <p className="mt-6 text-2xl font-bold text-brand-700">{formatPrecio(product.precio)}</p>

          <div className="mt-6">
            <AddToCartButtons
              productId={product.id}
              slug={product.slug}
              nombre={product.nombre}
              precio={product.precio}
              categoria={product.categoria}
              imagenUrl={imagenUrl}
              showQuantity
            />
          </div>

          {fichaTecnica?.url && (
            <a
              href={fichaTecnica.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block rounded-md bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-slate-700"
            >
              Ficha Técnica
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
