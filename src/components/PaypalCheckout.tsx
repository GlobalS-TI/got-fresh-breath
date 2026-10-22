'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'
import { type RefObject, useState } from 'react'

import { capturePaypalOrderAction, createPaypalOrderAction } from '@/actions/paypal'
import type { CartItemInput } from '@/lib/cart-pricing'

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const CAMPOS_FISCALES = ['rfc', 'razonSocial', 'regimenFiscal', 'usoCfdi', 'cpFiscal'] as const

export type Direccion = { calle: string; ciudad: string; estadoDireccion: string; cp: string }

type PaypalCheckoutProps = {
  items: CartItemInput[]
  direccion: Direccion
  requiereFactura: boolean
  // Formulario del checkout: de ahí se leen los datos fiscales al momento de pagar, porque
  // PayPal no envía el <form>.
  formRef: RefObject<HTMLFormElement | null>
  disabled: boolean
  onPedidoCreado?: () => void
  // Clases para los textos (cada checkout usa su propio estilo visual).
  className?: { titulo?: string; aviso?: string; error?: string }
}

// Botones de PayPal compartidos por los checkouts del sitio (CheckoutForm en /carrito y el
// formulario de /consultorios). La validación y el cobro real viven en los server actions.
export function PaypalCheckout({
  items,
  direccion,
  requiereFactura,
  formRef,
  disabled,
  onPedidoCreado,
  className = {},
}: PaypalCheckoutProps) {
  const [error, setError] = useState('')
  const router = useRouter()

  if (!PAYPAL_CLIENT_ID) {
    return <p className={className.aviso}>PayPal (próximamente)</p>
  }

  const direccionIncompleta =
    !direccion.calle.trim() || !direccion.ciudad.trim() || !direccion.estadoDireccion.trim() || !direccion.cp.trim()

  function facturaArgs() {
    if (!requiereFactura) return { requiereFactura: false }
    const datos = new FormData(formRef.current ?? undefined)
    return {
      requiereFactura: true,
      datosFiscales: Object.fromEntries(CAMPOS_FISCALES.map((c) => [c, String(datos.get(c) ?? '')])),
    }
  }

  return (
    <>
      <p className={className.titulo}>O paga ahora con PayPal o tarjeta</p>
      {direccionIncompleta && (
        <p className={className.aviso}>Completa calle, ciudad, estado y código postal para pagar con PayPal.</p>
      )}
      <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'MXN' }}>
        <PayPalButtons
          disabled={disabled || direccionIncompleta}
          forceReRender={[items, direccion, requiereFactura]}
          createOrder={async () => {
            setError('')
            const result = await createPaypalOrderAction(items, facturaArgs())
            if (result.error || !result.paypalOrderId) {
              setError(result.error ?? 'No se pudo iniciar el pago con PayPal.')
              throw new Error(result.error ?? 'No se pudo iniciar el pago con PayPal.')
            }
            return result.paypalOrderId
          }}
          onApprove={async (data) => {
            const result = await capturePaypalOrderAction({
              paypalOrderId: data.orderID,
              items,
              direccionEnvio: direccion,
              ...facturaArgs(),
            })
            if (result.success && result.orderId) {
              onPedidoCreado?.()
              router.push(`/pedido/${result.orderId}?nuevo=1`)
            } else {
              setError(result.error ?? 'No se pudo confirmar tu pedido.')
            }
          }}
          onError={() => setError('Ocurrió un error con PayPal. Intenta de nuevo.')}
        />
      </PayPalScriptProvider>
      {error && <p className={className.error}>{error}</p>}
    </>
  )
}
