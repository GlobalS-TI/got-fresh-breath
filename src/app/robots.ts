import type { MetadataRoute } from 'next'

import { SITIO_URL } from '@/lib/sitio'

// /robots.txt — deja indexar el sitio público y saca del índice el admin, la API de Payload y las
// páginas privadas de cuenta/compra (que además llevan `robots: { index: false }`).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/cuenta', '/carrito', '/pedido/', '/login', '/registro'],
    },
    sitemap: `${SITIO_URL}/sitemap.xml`,
    host: SITIO_URL,
  }
}
