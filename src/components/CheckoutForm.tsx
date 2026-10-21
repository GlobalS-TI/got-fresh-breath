'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useMemo, useRef, useState } from 'react'

import { checkoutAction, type CheckoutState } from '@/actions/checkout'
import { AvisoPrivacidadNotice } from '@/components/AvisoPrivacidadNotice'
import { DatosFiscalesFields } from '@/components/DatosFiscalesFields'
import { type Direccion, PaypalCheckout } from '@/components/PaypalCheckout'
import type { CheckoutUser } from '@/lib/checkout-user'
import { MAX_DISPENSADORES_INDIVIDUAL } from '@/lib/constants'
import { calcularTotales, formatPrecio } from '@/lib/precios'

const initialState: CheckoutState = {}

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

// Checkout de /carrito. La landing /consultorios tiene su propio formulario con el diseño de la
// landing, pero ambos usan los mismos server actions (checkoutAction / PayPal), el mismo
// PaypalCheckout y la misma función de totales (calcularTotales): solo cambia la presentación.
export function CheckoutForm({ user, lineas, redirectPath, onPedidoCreado }: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState(checkoutAction, initialState)
  const [direccion, setDireccion] = useState<Direccion>({ calle: '', ciudad: '', estadoDireccion: '', cp: '' })
  const [requiereFactura, setRequiereFactura] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const totales = calcularTotales(lineas)
  // Referencia estable: PaypalCheckout la usa en forceReRender de los botones de PayPal.
  const itemsInput = useMemo(
    () => lineas.map((l) => ({ productId: l.productId, cantidad: l.cantidad })),
    [lineas],
  )

  const rol = user?.rol ?? 'individual'
  const dispensadores = lineas
    .filter((l) => l.categoria === 'dispensador')
    .reduce((sum, l) => sum + l.cantidad, 0)
  const excedeLimite =
    rol !== 'empresa' && rol !== 'distribuidor' && dispensadores > MAX_DISPENSADORES_INDIVIDUAL
  const pideDatosFiscales = requiereFactura && !user?.rfcFacturacion

  useEffect(() => {
    if (state.success && state.orderId) {
      onPedidoCreado?.()
      router.push(`/pedido/${state.orderId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

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
            <PaypalCheckout
              items={itemsInput}
              direccion={direccion}
              requiereFactura={requiereFactura}
              formRef={formRef}
              disabled={excedeLimite}
              onPedidoCreado={onPedidoCreado}
              className={{
                titulo: "mb-3 text-center text-sm font-medium text-slate-700",
                aviso: "mb-3 text-center text-sm text-slate-500",
                error: "mt-3 text-sm text-red-600",
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
