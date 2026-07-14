import type { Payload } from 'payload'

import { MAX_DISPENSADORES_INDIVIDUAL } from '@/lib/constants'

export const MAX_ITEMS_DISTINTOS = 20
export const MAX_CANTIDAD_POR_ITEM = 99

export type CartItemInput = { productId: number; cantidad: number }
export type ResolvedOrderItem = { producto: number; cantidad: number; precioUnitario: number }

export type ResolveCartResult =
  | { ok: false; error: string }
  | { ok: true; resolvedItems: ResolvedOrderItem[]; total: number }

export function parseCartItemsJson(raw: string): CartItemInput[] | null {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.map((item) => ({
      productId: Number(item.productId),
      cantidad: Math.floor(Number(item.cantidad)),
    }))
  } catch {
    return null
  }
}

// Nunca confía en precios/cantidades del cliente — recalcula todo contra el producto real en la
// base de datos y aplica el límite de dispensadores para individual/invitado. Compartido entre
// el checkout de transferencia/cotización y el flujo de PayPal para no duplicar esta lógica.
export async function resolveCartItems(
  payload: Payload,
  items: CartItemInput[],
  rol: string,
): Promise<ResolveCartResult> {
  if (items.length === 0) {
    return { ok: false, error: 'Tu carrito está vacío.' }
  }
  if (items.length > MAX_ITEMS_DISTINTOS) {
    return { ok: false, error: 'Demasiados productos distintos en un solo pedido.' }
  }
  if (
    items.some(
      (i) =>
        !Number.isFinite(i.productId) ||
        !Number.isFinite(i.cantidad) ||
        i.cantidad < 1 ||
        i.cantidad > MAX_CANTIDAD_POR_ITEM,
    )
  ) {
    return { ok: false, error: 'Cantidad inválida en el carrito.' }
  }

  const resolvedItems: ResolvedOrderItem[] = []
  let total = 0
  let dispensadores = 0

  for (const item of items) {
    const product = await payload.findByID({ collection: 'products', id: item.productId }).catch(() => null)
    if (!product || !product.activo) {
      return { ok: false, error: 'Uno de los productos en tu carrito ya no está disponible.' }
    }
    if (product.categoria === 'dispensador') {
      dispensadores += item.cantidad
    }
    total += product.precio * item.cantidad
    resolvedItems.push({ producto: product.id, cantidad: item.cantidad, precioUnitario: product.precio })
  }

  if (rol !== 'empresa' && rol !== 'distribuidor' && dispensadores > MAX_DISPENSADORES_INDIVIDUAL) {
    return {
      ok: false,
      error: `Como cliente individual, el máximo es ${MAX_DISPENSADORES_INDIVIDUAL} dispensadores por pedido. Para pedidos mayores contáctanos o regístrate como empresa.`,
    }
  }

  return { ok: true, resolvedItems, total }
}
