import type { Metadata } from 'next'

// Dominio canónico del sitio. Va fijo (no sale de NEXT_PUBLIC_SERVER_URL) para que los previews y
// el entorno local nunca publiquen un canonical/OG que apunte a otro host.
export const SITIO_URL = 'https://www.gotfreshbreath.mx'
export const SITIO_NOMBRE = 'Got Fresh Breath'

// WhatsApp único del sitio (botón flotante, footer y contacto). La landing de /consultorios usa
// su propio número de campaña.
export const WHATSAPP_NUMERO = '528117810747'
export const WHATSAPP_TEXTO = '(81) 1781 0747'
export const WHATSAPP_MENSAJE =
  'Hola, quiero información sobre los dispensadores de enjuague bucal en comodato.'

export function whatsappUrl(mensaje?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

type MetadatosPagina = {
  titulo: string
  descripcion?: string
  // Ruta canónica de la página, p. ej. '/comodato'.
  ruta: string
}

// Metadata de una página pública con canonical y Open Graph. Next combina la metadata de layouts y
// páginas de forma superficial (un `openGraph` en la página reemplaza al del layout completo), así
// que cada página arma el suyo aquí en vez de heredarlo. La imagen OG sale de `opengraph-image`.
export function metadatosDePagina({ titulo, descripcion, ruta }: MetadatosPagina): Metadata {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: ruta,
      siteName: SITIO_NOMBRE,
      locale: 'es_MX',
      type: 'website',
    },
  }
}
