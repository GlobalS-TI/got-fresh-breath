import { TAMANO_OG, imagenOg } from '@/lib/imagen-og'

// Imagen OG por defecto de todas las páginas de (frontend).
export const alt = 'Got Fresh Breath - Dispensadores de enjuague bucal en comodato'
export const size = TAMANO_OG
export const contentType = 'image/png'

export default function Image() {
  return imagenOg({
    titulo: 'Dispensadores de enjuague bucal en comodato',
    subtitulo: 'Hoteles · Oficinas corporativas · Coworking',
  })
}
