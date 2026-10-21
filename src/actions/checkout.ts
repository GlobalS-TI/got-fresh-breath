'use server'

import { parseCartItemsJson, resolveCartItems } from '@/lib/cart-pricing'
import { getPayloadClient } from '@/lib/payload'
import { requireCheckoutUser } from '@/lib/checkout-user'
import { checkRateLimit } from '@/lib/rate-limit'
import { getSession } from '@/lib/session'

export type CheckoutState = { error?: string; success?: boolean; orderId?: number }

export async function checkoutAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const rateLimit = await checkRateLimit('checkout', 10, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error }
  }

  const checkoutUser = requireCheckoutUser(await getSession())
  if (!checkoutUser.ok) {
    return { error: checkoutUser.error }
  }
  const { user } = checkoutUser

  const items = parseCartItemsJson(String(formData.get('items') || '[]'))
  if (!items) {
    return { error: 'Carrito inválido.' }
  }

  const payload = await getPayloadClient()
  const resolved = await resolveCartItems(payload, items, user.rol)
  if (!resolved.ok) {
    return { error: resolved.error }
  }

  const metodoPagoRaw = String(formData.get('metodoPago') || 'cotizacion')
  const metodoPago: 'transferencia' | 'cotizacion' =
    metodoPagoRaw === 'transferencia' ? 'transferencia' : 'cotizacion'

  const direccionEnvio = {
    calle: String(formData.get('calle') || '').trim() || undefined,
    ciudad: String(formData.get('ciudad') || '').trim() || undefined,
    estado: String(formData.get('estadoDireccion') || '').trim() || undefined,
    cp: String(formData.get('cp') || '').trim() || undefined,
  }

  const createArgs = {
    collection: 'orders' as const,
    data: {
      usuario: user.id,
      items: resolved.resolvedItems,
      total: resolved.total,
      // Forzado también por el hook enforceInitialStatus — explícito aquí solo para satisfacer el tipo.
      estado: 'pendiente' as const,
      metodoPago,
      direccionEnvio,
    },
  }

  try {
    const order = await payload.create(createArgs)

    return { success: true, orderId: order.id }
  } catch {
    return { error: 'No se pudo crear tu pedido. Intenta de nuevo.' }
  }
}
