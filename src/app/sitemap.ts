import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { SITIO_URL } from '@/lib/sitio'

// Se regenera cada hora para incluir productos nuevos de la tienda sin redeploy.
export const revalidate = 3600

const PAGINAS: { ruta: string; prioridad: number }[] = [
  { ruta: '/', prioridad: 1 },
  { ruta: '/comodato', prioridad: 0.9 },
  { ruta: '/sectores', prioridad: 0.9 },
  { ruta: '/consultorios', prioridad: 0.8 },
  { ruta: '/tienda', prioridad: 0.8 },
  { ruta: '/distribuidor', prioridad: 0.7 },
  { ruta: '/instalacion', prioridad: 0.6 },
  { ruta: '/nosotros', prioridad: 0.6 },
  { ruta: '/contacto', prioridad: 0.6 },
  { ruta: '/aviso-de-privacidad', prioridad: 0.2 },
]

// /sitemap.xml — páginas públicas fijas más cada producto activo de la tienda.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paginas: MetadataRoute.Sitemap = PAGINAS.map(({ ruta, prioridad }) => ({
    url: `${SITIO_URL}${ruta === '/' ? '' : ruta}`,
    priority: prioridad,
  }))

  // Si la base no está disponible (p. ej. en un build sin DATABASE_URL) se publica el sitemap sin
  // productos en vez de tumbar el build; la siguiente regeneración los agrega.
  let productos: MetadataRoute.Sitemap = []
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { activo: { equals: true } },
      select: { slug: true, updatedAt: true },
      limit: 500,
      pagination: false,
    })
    productos = docs.map((p) => ({
      url: `${SITIO_URL}/tienda/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.5,
    }))
  } catch {
    productos = []
  }

  return [...paginas, ...productos]
}
