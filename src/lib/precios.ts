// Cálculo de totales de un pedido. Los precios y costos de envío de `products` se guardan SIN
// IVA; el IVA se suma aquí sobre (productos + envío). Única fuente de verdad: el servidor
// (resolveCartItems) y la UI del checkout usan esta misma función, así que el total que ve el
// cliente es el mismo que se cobra. Sin dependencias de Payload para poder importarse en cliente.

export const IVA_TASA = 0.16

export type LineaPedido = {
  precio: number
  costoEnvio?: number | null
  cantidad: number
}

export type TotalesPedido = {
  subtotal: number
  envio: number
  iva: number
  total: number
}

// Redondeo a centavos — evita totales como 1612.3999999 por aritmética de punto flotante, que
// PayPal rechazaría y que no coincidirían al comparar el monto cobrado con el del pedido.
function centavos(valor: number) {
  return Math.round(valor * 100) / 100
}

export function calcularTotales(lineas: LineaPedido[]): TotalesPedido {
  const subtotal = centavos(lineas.reduce((sum, l) => sum + l.precio * l.cantidad, 0))
  // El envío es por unidad: dos paquetes de 3 botellas pagan dos envíos.
  const envio = centavos(lineas.reduce((sum, l) => sum + (l.costoEnvio ?? 0) * l.cantidad, 0))
  const iva = centavos((subtotal + envio) * IVA_TASA)
  return { subtotal, envio, iva, total: centavos(subtotal + envio + iva) }
}

export function formatPrecio(precio: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}
