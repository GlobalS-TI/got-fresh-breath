'use server'

import type { CheckoutState } from '@/actions/checkout'
import { type CartItemInput, resolveCartItems } from '@/lib/cart-pricing'
import { getPayloadClient } from '@/lib/payload'
import { capturePaypalOrder, createPaypalOrder } from '@/lib/paypal'
import { checkRateLimit } from '@/lib/rate-limit'
import { getSession } from '@/lib/session'

export async function createPaypalOrderAction(items: CartItemInput[]): Promise<{ paypalOrderId?: string; error?: string }> {
  const rateLimit = await checkRateLimit('checkout', 10, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error }
  }

  const user = await getSession()
  const payload = await getPayloadClient()

  const resolved = await resolveCartItems(payload, items, user?.rol ?? 'individual')
  if (!resolved.ok) {
    return { error: resolved.error }
  }

  try {
    const paypalOrderId = await createPaypalOrder(resolved.total)
    return { paypalOrderId }
  } catch {
    return { error: 'No se pudo iniciar el pago con PayPal. Intenta de nuevo.' }
  }
}

type CaptureArgs = {
  paypalOrderId: string
  items: CartItemInput[]
  guestEmail?: string
  direccionEnvio?: { calle?: string; ciudad?: string; estadoDireccion?: string; cp?: string }
}

export async function capturePaypalOrderAction({
  paypalOrderId,
  items,
  guestEmail,
  direccionEnvio,
}: CaptureArgs): Promise<CheckoutState> {
  const rateLimit = await checkRateLimit('checkout', 10, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error }
  }

  const user = await getSession()

  if (!user && !guestEmail?.trim()) {
    return { error: 'Ingresa un correo para continuar como invitado, o inicia sesión.' }
  }

  // Se valida y se rechaza ANTES de capturar el pago — nunca cobrar primero y preguntar después.
  if (
    !direccionEnvio?.calle?.trim() ||
    !direccionEnvio?.ciudad?.trim() ||
    !direccionEnvio?.estadoDireccion?.trim() ||
    !direccionEnvio?.cp?.trim()
  ) {
    return { error: 'Completa calle, ciudad, estado y código postal antes de pagar con PayPal.' }
  }

  const payload = await getPayloadClient()
  const resolved = await resolveCartItems(payload, items, user?.rol ?? 'individual')
  if (!resolved.ok) {
    return { error: resolved.error }
  }

  try {
    const capture = await capturePaypalOrder(paypalOrderId)
    if (capture.status !== 'COMPLETED') {
      return { error: 'PayPal no confirmó el pago. Intenta de nuevo.' }
    }
  } catch {
    return { error: 'No se pudo confirmar el pago con PayPal.' }
  }

  try {
    const order = await payload.create({
      collection: 'orders',
      data: {
        usuario: user?.id,
        guestEmail: user ? undefined : guestEmail?.trim(),
        items: resolved.resolvedItems,
        total: resolved.total,
        // El hook enforceInitialStatus decide el estado real a partir de context.paymentVerified.
        estado: 'pendiente' as const,
        metodoPago: 'paypal' as const,
        paypalOrderId,
        direccionEnvio: {
          calle: direccionEnvio?.calle,
          ciudad: direccionEnvio?.ciudad,
          estado: direccionEnvio?.estadoDireccion,
          cp: direccionEnvio?.cp,
        },
      },
      context: { paymentVerified: true },
    })

    return { success: true, orderId: order.id, accessToken: order.accessToken ?? undefined }
  } catch {
    return { error: 'El pago se procesó pero no pudimos registrar tu pedido. Contáctanos con tu referencia de PayPal.' }
  }
}
