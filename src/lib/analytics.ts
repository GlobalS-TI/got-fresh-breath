// Eventos de conversión para Google Tag Manager. Solo empujan a `window.dataLayer`; los tags de
// GA4/Google Ads que los consumen se configuran en tagmanager.google.com con triggers de tipo
// "Evento personalizado" usando estos mismos nombres.
//
// Eventos que manda el sitio:
// - generate_lead       → formulario de lead enviado (tipo_formulario: comodato/contacto/...)
// - whatsapp_click      → clic en cualquier enlace a WhatsApp
// - email_click         → clic en un enlace mailto:
// - phone_click         → clic en un enlace tel:
// - solicitar_comodato  → clic en un CTA marcado con data-evento="solicitar_comodato"
// - purchase            → pedido pagado con PayPal (value, currency, transaction_id)
// - pedido_creado       → pedido por transferencia o cotización, todavía sin pagar

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] }

export function trackEvent(evento: string, parametros: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as DataLayerWindow
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event: evento, ...parametros })
}
