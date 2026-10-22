'use client'

import { useEffect } from 'react'

import { trackEvent } from '@/lib/analytics'

// Un solo listener delegado en el documento para los clics que cuentan como conversión
// (WhatsApp, correo, teléfono y CTAs con data-evento). Así cualquier enlace nuevo — incluso en
// componentes de servidor como el Footer o en las landings — se rastrea sin tener que volverlo
// componente de cliente.
export function RastreoClics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const elemento = (e.target as Element | null)?.closest?.('a, [data-evento]')
      if (!elemento) return

      const ubicacion = window.location.pathname
      const evento = elemento.getAttribute('data-evento')
      if (evento) {
        trackEvent(evento, { ubicacion })
        return
      }

      const href = elemento.getAttribute('href') ?? ''
      if (href.includes('wa.me/') || href.includes('api.whatsapp.com')) {
        trackEvent('whatsapp_click', { ubicacion })
      } else if (href.startsWith('mailto:')) {
        trackEvent('email_click', { ubicacion })
      } else if (href.startsWith('tel:')) {
        trackEvent('phone_click', { ubicacion })
      }
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
