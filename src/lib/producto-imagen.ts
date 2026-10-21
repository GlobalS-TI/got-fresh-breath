import type { Product } from '@/payload-types'

// URLs de las imágenes de un producto: primero las subidas a Media; si no hay ninguna, la imagen
// estática del repo (campo imagenEstatica, p. ej. los kits de /consultorios). Usar esto en vez de
// leer product.imagenes directo, para que los productos con foto estática no salgan sin imagen.
export function imagenesDeProducto(product: Pick<Product, 'imagenes' | 'imagenEstatica'>): string[] {
  const subidas = (product.imagenes ?? [])
    .map((entry) => (typeof entry.imagen === 'object' ? entry.imagen?.url : null))
    .filter((url): url is string => Boolean(url))
  if (subidas.length > 0) return subidas
  return product.imagenEstatica ? [product.imagenEstatica] : []
}

export function imagenPrincipalDeProducto(product: Pick<Product, 'imagenes' | 'imagenEstatica'>): string | null {
  return imagenesDeProducto(product)[0] ?? null
}
