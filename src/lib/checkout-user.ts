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
