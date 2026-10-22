import { TAMANO_OG, imagenOg } from '@/lib/imagen-og'

export const alt = 'Got Fresh Breath para consultorios dentales'
export const size = TAMANO_OG
export const contentType = 'image/png'

export default function Image() {
  return imagenOg({
    titulo: 'El detalle que tus pacientes recuerdan.',
    subtitulo: 'Dispensador de enjuague bucal para consultorios dentales',
  })
}
