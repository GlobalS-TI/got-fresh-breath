'use client'

import { useEffect } from 'react'

import { trackEvent } from '@/lib/analytics'

type RastreoPedidoProps = {
  orderId: number
  total: number
  metodoPago: string
}

// Manda la conversión de un pedido recién creado. Solo se monta cuando el checkout redirige con
// `?nuevo=1` (no al abrir el pedido desde "Mis pedidos"), y sessionStorage evita contarlo dos veces
// si el cliente recarga la página de confirmación.
export function RastreoPedido({ orderId, total, metodoPago }: RastreoPedidoProps) {
  useEffect(() => {
    const clave = `gfb-pedido-rastreado-${orderId}`
    try {
      if (sessionStorage.getItem(clave)) return
      sessionStorage.setItem(clave, '1')
    } catch {
      // Sin sessionStorage (modo privado estricto) se rastrea igual, a riesgo de duplicar.
    }

    trackEvent(metodoPago === 'paypal' ? 'purchase' : 'pedido_creado', {
      transaction_id: String(orderId),
      value: total,
      currency: 'MXN',
      metodo_pago: metodoPago,
    })
  }, [orderId, total, metodoPago])

  return null
}
