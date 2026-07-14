// Cliente mínimo de la API REST de PayPal (Orders v2). No usa el SDK oficial de Node —
// server-to-server con fetch es suficiente para crear/capturar órdenes.
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com'

function getCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret }
}

export function isPaypalConfigured() {
  return getCredentials() !== null
}

async function getAccessToken(): Promise<string> {
  const credentials = getCredentials()
  if (!credentials) {
    throw new Error('PayPal no está configurado (faltan PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET).')
  }

  const auth = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString('base64')
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    throw new Error(`No se pudo autenticar con PayPal (${res.status}).`)
  }

  const data = await res.json()
  return data.access_token
}

export async function createPaypalOrder(totalMXN: number): Promise<string> {
  const accessToken = await getAccessToken()

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'MXN',
            value: totalMXN.toFixed(2),
          },
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`No se pudo crear la orden de PayPal (${res.status}).`)
  }

  const data = await res.json()
  return data.id
}

export async function capturePaypalOrder(paypalOrderId: string): Promise<{ status: string }> {
  const accessToken = await getAccessToken()

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`No se pudo capturar el pago de PayPal (${res.status}).`)
  }

  const data = await res.json()
  return { status: data.status }
}
