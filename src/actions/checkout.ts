'use server'

import { getPayloadClient } from '@/lib/payload'
import { getSession } from '@/lib/session'
import { MAX_DISPENSADORES_INDIVIDUAL } from '@/lib/constants'

export type CheckoutState = { error?: string; success?: boolean; orderId?: number }

const MAX_ITEMS_DISTINTOS = 20
const MAX_CANTIDAD_POR_ITEM = 99

type CartItemInput = { productId: number; cantidad: number }

export async function checkoutAction(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const user = await getSession()
  const guestEmail = String(formData.get('guestEmail') || '').trim()

  if (!user && !guestEmail) {
    return { error: 'Ingresa un correo para continuar como invitado, o inicia sesión.' }
  }

  let items: CartItemInput[]
  try {
    const raw = JSON.parse(String(formData.get('items') || '[]'))
    if (!Array.isArray(raw)) throw new Error('invalid')
    items = raw.map((item) => ({
      productId: Number(item.productId),
      cantidad: Math.floor(Number(item.cantidad)),
    }))
  } catch {
    return { error: 'Carrito inválido.' }
  }

  if (items.length === 0) {
    return { error: 'Tu carrito está vacío.' }
  }
  if (items.length > MAX_ITEMS_DISTINTOS) {
    return { error: 'Demasiados productos distintos en un solo pedido.' }
  }
  if (items.some((i) => !Number.isFinite(i.productId) || !Number.isFinite(i.cantidad) || i.cantidad < 1 || i.cantidad > MAX_CANTIDAD_POR_ITEM)) {
    return { error: 'Cantidad inválida en el carrito.' }
  }

  const payload = await getPayloadClient()

  const resolvedItems: { producto: number; cantidad: number; precioUnitario: number }[] = []
  let total = 0
  let dispensadores = 0

  for (const item of items) {
    const product = await payload.findByID({ collection: 'products', id: item.productId }).catch(() => null)
    if (!product || !product.activo) {
      return { error: 'Uno de los productos en tu carrito ya no está disponible.' }
    }
    if (product.categoria === 'dispensador') {
      dispensadores += item.cantidad
    }
    total += product.precio * item.cantidad
    resolvedItems.push({ producto: product.id, cantidad: item.cantidad, precioUnitario: product.precio })
  }

  const rol = user?.rol ?? 'individual'
  if (rol !== 'empresa' && rol !== 'distribuidor' && dispensadores > MAX_DISPENSADORES_INDIVIDUAL) {
    return {
      error: `Como cliente individual, el máximo es ${MAX_DISPENSADORES_INDIVIDUAL} dispensadores por pedido. Para pedidos mayores contáctanos o regístrate como empresa.`,
    }
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
      usuario: user?.id,
      guestEmail: user ? undefined : guestEmail,
      items: resolvedItems,
      total,
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
