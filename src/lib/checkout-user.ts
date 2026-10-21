import type { Payload } from 'payload'

import { type DatosFiscales, tieneDatosFiscalesCompletos } from '@/lib/datos-fiscales'
import type { User } from '@/payload-types'

// Lo mínimo del usuario que necesita el componente de checkout (CheckoutForm) — se arma en el
// servidor para no mandar el documento completo del usuario al cliente.
export type CheckoutUser = {
  rol: string
  telefono: string | null
  // RFC con el que se facturará si ya tiene datos fiscales completos en su perfil; si no, null y
  // el checkout se los pide al marcar "Requiero factura".
  rfcFacturacion: string | null
}

export function toCheckoutUser(user: User | null): CheckoutUser | null {
  if (!user) return null
  return {
    rol: user.rol,
    telefono: user.telefono ?? null,
    rfcFacturacion: tieneDatosFiscalesCompletos(user.datosFiscales) ? (user.datosFiscales?.rfc ?? null) : null,
  }
}

// Todo pedido requiere cuenta (ya no hay compra como invitado) y teléfono para poder contactar
// al cliente. Compartido entre el checkout de transferencia/cotización y el flujo de PayPal.
export function requireCheckoutUser<T extends { telefono?: string | null }>(
  user: T | null,
): { ok: true; user: T } | { ok: false; error: string } {
  if (!user) {
    return { ok: false, error: 'Inicia sesión o crea una cuenta para hacer tu pedido.' }
  }
  if (!user.telefono?.trim()) {
    return { ok: false, error: 'Agrega tu teléfono en "Mi cuenta" para poder hacer tu pedido.' }
  }
  return { ok: true, user }
}

// Guarda en el perfil los datos fiscales que el cliente capturó en el checkout (ver
// resolverFactura), para no volver a pedírselos. Se llama DESPUÉS de crear el pedido y nunca
// lo hace fallar: el pedido ya existe y ventas puede pedir los datos por otro medio.
export async function guardarDatosFiscalesDelPedido(
  payload: Payload,
  user: { id: number },
  datosFiscales: DatosFiscales | null,
) {
  if (!datosFiscales) return

  try {
    await payload.update({ collection: 'users', id: user.id, data: { datosFiscales } })
  } catch (err) {
    console.error('No se pudieron guardar los datos fiscales del checkout:', err)
  }
}
