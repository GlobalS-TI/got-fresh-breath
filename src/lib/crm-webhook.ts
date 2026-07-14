// Webhook saliente hacia el CRM — inactivo hasta que CRM_WEBHOOK_URL esté configurado en .env.
// Firma el payload con CRM_WEBHOOK_SECRET vía header x-webhook-secret para que el CRM pueda
// verificar que la solicitud viene de este sitio.
export async function notifyCrm(payload: Record<string, unknown>) {
  const url = process.env.CRM_WEBHOOK_URL
  const secret = process.env.CRM_WEBHOOK_SECRET
  if (!url || !secret) return

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': secret,
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    // Nunca debe tronar la creación del lead por un fallo del webhook del CRM.
    console.error('Error notificando al webhook del CRM:', err)
  }
}
