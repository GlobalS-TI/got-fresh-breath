'use server'

import type { CheckoutState } from '@/actions/checkout'
import { type CartItemInput, resolveCartItems } from '@/lib/cart-pricing'
import { guardarDatosFiscalesDelPedido, requireCheckoutUser } from '@/lib/checkout-user'
import { type DatosFiscalesInput, resolverFactura } from '@/lib/datos-fiscales'
import { getPayloadClient } from '@/lib/payload'
import { capturePaypalOrder, createPaypalOrder, getPaypalOrderAmount } from '@/lib/paypal'
import { checkRateLimit } from '@/lib/rate-limit'
import { getSession } from '@/lib/session'

type FacturaArgs = {
  requiereFactura?: boolean
  datosFiscales?: Exclude<DatosFiscalesInput, FormData>
}

export async function createPaypalOrderAction(
  items: CartItemInput[],
  { requiereFactura = false, datosFiscales = {} }: FacturaArgs = {},
): Promise<{ paypalOrderId?: string; error?: string }> {
  const rateLimit = await checkRateLimit('checkout', 10, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error }
  }

  const checkoutUser = requireCheckoutUser(await getSession())
  if (!checkoutUser.ok) {
    return { error: checkoutUser.error }
  }

  // Se valida aquí también (no solo al capturar) para que el error salga antes de abrir PayPal.
  const factura = resolverFactura(checkoutUser.user, requiereFactura, datosFiscales)
  if (!factura.ok) {
    return { error: factura.error }
  }

  const payload = await getPayloadClient()

  const resolved = await resolveCartItems(payload, items, checkoutUser.user.rol)
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

type CaptureArgs = FacturaArgs & {
  paypalOrderId: string
  items: CartItemInput[]
  direccionEnvio?: { calle?: string; ciudad?: string; estadoDireccion?: string; cp?: string }
}

export async function capturePaypalOrderAction({
  paypalOrderId,
  items,
  direccionEnvio,
  requiereFactura = false,
  datosFiscales = {},
}: CaptureArgs): Promise<CheckoutState> {
  const rateLimit = await checkRateLimit('checkout', 10, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error }
  }

  const checkoutUser = requireCheckoutUser(await getSession())
  if (!checkoutUser.ok) {
    return { error: checkoutUser.error }
  }
  const { user } = checkoutUser

  // Todo se valida y se rechaza ANTES de capturar el pago — nunca cobrar primero y preguntar después.
  if (
    !direccionEnvio?.calle?.trim() ||
    !direccionEnvio?.ciudad?.trim() ||
    !direccionEnvio?.estadoDireccion?.trim() ||
    !direccionEnvio?.cp?.trim()
  ) {
    return { error: 'Completa calle, ciudad, estado y código postal antes de pagar con PayPal.' }
  }

  const factura = resolverFactura(user, requiereFactura, datosFiscales)
  if (!factura.ok) {
    return { error: factura.error }
  }

  const payload = await getPayloadClient()
  const resolved = await resolveCartItems(payload, items, user.rol)
  if (!resolved.ok) {
    return { error: resolved.error }
  }

  // La orden de PayPal se creó en un request anterior con los items de ese momento; los `items`
  // de este request vienen del cliente y podrían ser otros. Si el monto no coincide con el total
  // recalculado, no se captura.
  try {
    const amount = await getPaypalOrderAmount(paypalOrderId)
    if (amount.currency !== 'MXN' || amount.value !== resolved.total.toFixed(2)) {
      return { error: 'El monto del pago no coincide con tu pedido. Recarga la página e intenta de nuevo.' }
    }
  } catch {
    return { error: 'No se pudo verificar el pago con PayPal.' }
  }

  try {
    const capture = await capturePaypalOrder(paypalOrderId)
    if (capture.status !== 'COMPLETED') {
      return { error: 'PayPal no confirmó el pago. Intenta de nuevo.' }
    }
  } catch {
    return { error: 'No se pudo confirmar el pago con PayPal.' }
  }

  let orderId: number
  try {
    const order = await payload.create({
      collection: 'orders',
      data: {
        usuario: user.id,
        items: resolved.resolvedItems,
        subtotal: resolved.subtotal,
        envio: resolved.envio,
        iva: resolved.iva,
        total: resolved.total,
        requiereFactura: factura.requiereFactura,
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
    orderId = order.id
  } catch {
    return { error: 'El pago se procesó pero no pudimos registrar tu pedido. Contáctanos con tu referencia de PayPal.' }
  }

  await guardarDatosFiscalesDelPedido(payload, user, factura.datosFiscalesNuevos)

  return { success: true, orderId }
}
