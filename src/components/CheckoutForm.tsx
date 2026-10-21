'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useRef, useState } from 'react'

import { checkoutAction, type CheckoutState } from '@/actions/checkout'
import { capturePaypalOrderAction, createPaypalOrderAction } from '@/actions/paypal'
import { AvisoPrivacidadNotice } from '@/components/AvisoPrivacidadNotice'
import { DatosFiscalesFields } from '@/components/DatosFiscalesFields'
import type { CheckoutUser } from '@/lib/checkout-user'
import { MAX_DISPENSADORES_INDIVIDUAL } from '@/lib/constants'
import { calcularTotales, formatPrecio } from '@/lib/precios'

const initialState: CheckoutState = {}
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
const CAMPOS_FISCALES = ['rfc', 'razonSocial', 'regimenFiscal', 'usoCfdi', 'cpFiscal'] as const

export type LineaCheckout = {
  productId: number
  nombre: string
  precio: number
  costoEnvio: number
  cantidad: number
  categoria: 'dispensador' | 'consumible'
}

type CheckoutFormProps = {
  user: CheckoutUser | null
  lineas: LineaCheckout[]
  // A dónde regresar después de iniciar sesión / crear cuenta (p. ej. "/carrito").
  redirectPath: string
  // Se llama justo antes de navegar a la confirmación (p. ej. para vaciar el carrito).
  onPedidoCreado?: () => void
}

// Checkout único del sitio: lo usan /carrito (con los items del carrito) y la landing
// /consultorios (con el paquete elegido). Toda la validación y el cálculo real ocurren en los
// server actions — aquí solo se muestra el desglose con la misma función (calcularTotales).
export function CheckoutForm({ user, lineas, redirectPath, onPedidoCreado }: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState(checkoutAction, initialState)
  const [paypalError, setPaypalError] = useState('')
  const [direccion, setDireccion] = useState({ calle: '', ciudad: '', estadoDireccion: '', cp: '' })
  const [requiereFactura, setRequiereFactura] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const totales = calcularTotales(lineas)
  const itemsInput = lineas.map((l) => ({ productId: l.productId, cantidad: l.cantidad }))

  const rol = user?.rol ?? 'individual'
  const dispensadores = lineas
    .filter((l) => l.categoria === 'dispensador')
    .reduce((sum, l) => sum + l.cantidad, 0)
  const excedeLimite =
    rol !== 'empresa' && rol !== 'distribuidor' && dispensadores > MAX_DISPENSADORES_INDIVIDUAL
  const direccionIncompleta =
    !direccion.calle.trim() ||
    !direccion.ciudad.trim() ||
    !direccion.estadoDireccion.trim() ||
    !direccion.cp.trim()
  const pideDatosFiscales = requiereFactura && !user?.rfcFacturacion

  useEffect(() => {
    if (state.success && state.orderId) {
      onPedidoCreado?.()
      router.push(`/pedido/${state.orderId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // PayPal no envía el <form>, así que los datos fiscales se leen del formulario al momento.
  function facturaArgs() {
    if (!requiereFactura) return { requiereFactura: false }
    const datos = new FormData(formRef.current ?? undefined)
    return {
      requiereFactura: true,
      datosFiscales: Object.fromEntries(CAMPOS_FISCALES.map((c) => [c, String(datos.get(c) ?? '')])),
    }
  }

  const authQuery = `?redirect=${encodeURIComponent(redirectPath)}`

  return (
    <div className="flex flex-col gap-6">
      <dl className="flex flex-col gap-1 rounded-lg border border-slate-200 p-6 text-sm text-slate-700">
        <div className="flex justify-between">
          <dt>Productos</dt>
          <dd>{formatPrecio(totales.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd>{formatPrecio(totales.envio)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>IVA (16%)</dt>
          <dd>{formatPrecio(totales.iva)}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900">
          <dt>Total</dt>
          <dd>{formatPrecio(totales.total)}</dd>
        </div>
      </dl>

      {excedeLimite && (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Como cliente individual, el máximo es {MAX_DISPENSADORES_INDIVIDUAL} dispensadores por
          pedido (tu pedido tiene {dispensadores}). Reduce la cantidad para continuar, o{' '}
          <Link href="/distribuidor" className="font-semibold underline">
            contáctanos para pedidos mayores
          </Link>
          .
        </p>
      )}

      {!user ? (
        <div className="rounded-lg border border-slate-200 p-6 text-center">
          <p className="mb-4 text-slate-700">Inicia sesión o crea una cuenta para hacer tu pedido.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/login${authQuery}`}
              className="rounded-md bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
            >
              Iniciar sesión
            </Link>
            <Link
              href={`/registro${authQuery}`}
              className="rounded-md border border-brand-600 px-5 py-2 font-semibold text-brand-600 hover:bg-brand-50"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      ) : !user.telefono ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-6 text-center text-sm text-amber-800">
          Agrega tu teléfono en{' '}
          <Link href="/cuenta" className="font-semibold underline">
            Mi cuenta
          </Link>{' '}
          para poder hacer tu pedido.
        </div>
      ) : (
        <>
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-4 rounded-lg border border-slate-200 p-6"
          >
            <input type="hidden" name="items" value={JSON.stringify(itemsInput)} />

            <fieldset className="grid gap-3 sm:grid-cols-2">
              <legend className="mb-1 text-sm font-semibold text-slate-900">Dirección de envío</legend>
              <input
                name="calle"
                placeholder="Calle y número"
                value={direccion.calle}
                onChange={(e) => setDireccion((d) => ({ ...d, calle: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 sm:col-span-2"
              />
              <input
                name="ciudad"
                placeholder="Ciudad"
                value={direccion.ciudad}
                onChange={(e) => setDireccion((d) => ({ ...d, ciudad: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
              <input
                name="estadoDireccion"
                placeholder="Estado"
                value={direccion.estadoDireccion}
                onChange={(e) => setDireccion((d) => ({ ...d, estadoDireccion: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
              <input
                name="cp"
                placeholder="Código postal"
                value={direccion.cp}
                onChange={(e) => setDireccion((d) => ({ ...d, cp: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
            </fieldset>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                name="requiereFactura"
                checked={requiereFactura}
                onChange={(e) => setRequiereFactura(e.target.checked)}
              />
              Requiero factura
            </label>
            {requiereFactura && user.rfcFacturacion && (
              <p className="text-sm text-slate-600">
                Se facturará al RFC <strong>{user.rfcFacturacion}</strong>. Puedes cambiar tus datos
                fiscales en{' '}
                <Link href="/cuenta" className="font-semibold text-brand-600 hover:underline">
                  Mi cuenta
                </Link>
                .
              </p>
            )}
            {pideDatosFiscales && <DatosFiscalesFields enCheckout />}

            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Método de pago
              <select
                name="metodoPago"
                defaultValue="cotizacion"
                className="rounded-md border border-slate-300 px-3 py-2"
              >
                <option value="cotizacion">Solicitar cotización</option>
                <option value="transferencia">Transferencia bancaria</option>
              </select>
            </label>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}

            <AvisoPrivacidadNotice />

            <button
              type="submit"
              disabled={pending || excedeLimite}
              title={excedeLimite ? 'Reduce la cantidad de dispensadores para continuar' : undefined}
              className="rounded-md bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? 'Procesando…' : 'Confirmar pedido'}
            </button>
          </form>

          <div className="rounded-lg border border-slate-200 p-6">
            {PAYPAL_CLIENT_ID ? (
              <>
                <p className="mb-3 text-center text-sm font-medium text-slate-700">
                  O paga ahora con PayPal o tarjeta
                </p>
                {direccionIncompleta && (
                  <p className="mb-3 text-center text-sm text-slate-500">
                    Completa calle, ciudad, estado y código postal arriba para pagar con PayPal.
                  </p>
                )}
                <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'MXN' }}>
                  <PayPalButtons
                    disabled={excedeLimite || direccionIncompleta}
                    forceReRender={[lineas, direccion, requiereFactura]}
                    createOrder={async () => {
                      setPaypalError('')
                      const result = await createPaypalOrderAction(itemsInput, facturaArgs())
                      if (result.error || !result.paypalOrderId) {
                        setPaypalError(result.error ?? 'No se pudo iniciar el pago con PayPal.')
                        throw new Error(result.error ?? 'No se pudo iniciar el pago con PayPal.')
                      }
                      return result.paypalOrderId
                    }}
                    onApprove={async (data) => {
                      const result = await capturePaypalOrderAction({
                        paypalOrderId: data.orderID,
                        items: itemsInput,
                        direccionEnvio: direccion,
                        ...facturaArgs(),
                      })
                      if (result.success && result.orderId) {
                        onPedidoCreado?.()
                        router.push(`/pedido/${result.orderId}`)
                      } else {
                        setPaypalError(result.error ?? 'No se pudo confirmar tu pedido.')
                      }
                    }}
                    onError={() => setPaypalError('Ocurrió un error con PayPal. Intenta de nuevo.')}
                  />
                </PayPalScriptProvider>
                {paypalError && <p className="mt-3 text-sm text-red-600">{paypalError}</p>}
              </>
            ) : (
              <p className="text-center text-sm text-slate-400">PayPal (próximamente)</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
