import { Resend } from 'resend'

// onboarding@resend.dev es el dominio de pruebas de Resend — funciona sin verificar dominio
// propio. Cambiar RESEND_FROM_EMAIL en .env en cuanto el dominio de gotfreshbreath.mx quede
// verificado en Resend.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Correo interno que recibe notificaciones de nuevos leads/pedidos.
// Configurable vía NOTIFICATION_EMAIL en .env; usa el contacto público del sitio si no se define.
export const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'contacto@gotfreshbreath.mx'

type SendEmailArgs = {
  to: string
  subject: string
  html: string
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

// Los textos que van dentro de las plantillas HTML de correo vienen de campos que llena el
// usuario (nombre, notas, email...) — hay que escaparlos antes de interpolarlos, o alguien podría
// inyectar HTML/markup en un correo que abre nuestro propio equipo de ventas.
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY no configurada — se omite el envío de correo:', subject)
    return
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html })
  } catch (err) {
    // Nunca debe tronar la operación de negocio (crear lead/orden) por un fallo de correo.
    console.error('Error enviando correo vía Resend:', err)
  }
}
