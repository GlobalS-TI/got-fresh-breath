'use client'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'

import { checkoutAction, type CheckoutState } from '@/actions/checkout'
import { capturePaypalOrderAction, createPaypalOrderAction } from '@/actions/paypal'
import { useCart } from '@/lib/cart-context'
import { MAX_DISPENSADORES_INDIVIDUAL } from '@/lib/constants'

const initialState: CheckoutState = {}
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

function formatPrecio(precio: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}

type CarritoClientProps = {
  user: { nombre: string; email: string; rol: string } | null
}

export function CarritoClient({ user }: CarritoClientProps) {
  const { items, updateCantidad, removeItem, clear, total } = useCart()
  const [state, formAction, pending] = useActionState(checkoutAction, initialState)
  const [paypalError, setPaypalError] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [direccion, setDireccion] = useState({ calle: '', ciudad: '', estadoDireccion: '', cp: '' })
  const router = useRouter()

  const rol = user?.rol ?? 'individual'
  const dispensadoresEnCarrito = items
    .filter((i) => i.categoria === 'dispensador')
    .reduce((sum, i) => sum + i.cantidad, 0)
  const excedeLimite =
    rol !== 'empresa' &&
    rol !== 'distribuidor' &&
    dispensadoresEnCarrito > MAX_DISPENSADORES_INDIVIDUAL
  const faltaCorreoInvitado = !user && !guestEmail.trim()
  const direccionIncompleta =
    !direccion.calle.trim() ||
    !direccion.ciudad.trim() ||
    !direccion.estadoDireccion.trim() ||
    !direccion.cp.trim()

  useEffect(() => {
    if (state.success && state.orderId) {
      clear()
      const query = state.accessToken ? `?token=${state.accessToken}` : ''
      router.push(`/pedido/${state.orderId}${query}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Tu carrito está vacío</h1>
        <p className="mb-6 text-slate-600">Explora nuestros dispensadores y consumibles.</p>
        <Link href="/tienda" className="font-semibold text-brand-600 hover:underline">
          Ir a la tienda
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Tu carrito</h1>

      <div className="mb-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-semibold text-slate-900">{item.nombre}</p>
              <p className="text-sm text-slate-600">{formatPrecio(item.precio)} c/u</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={99}
                value={item.cantidad}
                onChange={(e) => updateCantidad(item.productId, Number(e.target.value))}
                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-center"
              />
              <p className="w-24 text-right font-semibold text-slate-900">
                {formatPrecio(item.precio * item.cantidad)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-sm text-red-600 hover:underline"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mb-8 text-right text-xl font-bold text-slate-900">Total: {formatPrecio(total)}</p>

      {excedeLimite && (
        <p className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Como cliente individual, el máximo es {MAX_DISPENSADORES_INDIVIDUAL} dispensadores por
          pedido (tienes {dispensadoresEnCarrito} en tu carrito). Quita algunos para continuar, o{' '}
          <Link href="/distribuidor" className="font-semibold underline">
            contáctanos para pedidos mayores
          </Link>
          .
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-slate-200 p-6">
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(items.map((i) => ({ productId: i.productId, cantidad: i.cantidad })))}
        />

        {!user && (
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Correo (compra como invitado)
            <input
              type="email"
              name="guestEmail"
              required
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
        )}

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

        <button
          type="submit"
          disabled={pending || excedeLimite}
          title={excedeLimite ? 'Reduce la cantidad de dispensadores para continuar' : undefined}
          className="rounded-md bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Procesando…' : 'Confirmar pedido'}
        </button>
      </form>

      <div className="mt-6 rounded-lg border border-slate-200 p-6">
        {PAYPAL_CLIENT_ID ? (
          <>
            <p className="mb-3 text-center text-sm font-medium text-slate-700">O paga ahora con PayPal</p>
            {faltaCorreoInvitado && (
              <p className="mb-3 text-center text-sm text-slate-500">
                Ingresa tu correo arriba para pagar como invitado.
              </p>
            )}
            {direccionIncompleta && (
              <p className="mb-3 text-center text-sm text-slate-500">
                Completa calle, ciudad, estado y código postal arriba para pagar con PayPal.
              </p>
            )}
            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'MXN' }}>
              <PayPalButtons
                disabled={excedeLimite || faltaCorreoInvitado || direccionIncompleta}
                forceReRender={[items, guestEmail, direccion]}
                createOrder={async () => {
                  setPaypalError('')
                  const cartItems = items.map((i) => ({ productId: i.productId, cantidad: i.cantidad }))
                  const result = await createPaypalOrderAction(cartItems)
                  if (result.error || !result.paypalOrderId) {
                    setPaypalError(result.error ?? 'No se pudo iniciar el pago con PayPal.')
                    throw new Error(result.error ?? 'No se pudo iniciar el pago con PayPal.')
                  }
                  return result.paypalOrderId
                }}
                onApprove={async (data) => {
                  const cartItems = items.map((i) => ({ productId: i.productId, cantidad: i.cantidad }))
                  const result = await capturePaypalOrderAction({
                    paypalOrderId: data.orderID,
                    items: cartItems,
                    guestEmail: user ? undefined : guestEmail,
                    direccionEnvio: direccion,
                  })
                  if (result.success && result.orderId) {
                    clear()
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
    </div>
  )
}
