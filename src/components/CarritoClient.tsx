'use client'

import Link from 'next/link'

import { CheckoutForm } from '@/components/CheckoutForm'
import { useCart } from '@/lib/cart-context'
import type { CheckoutUser } from '@/lib/checkout-user'
import { formatPrecio } from '@/lib/precios'

type CarritoClientProps = {
  user: CheckoutUser | null
}

export function CarritoClient({ user }: CarritoClientProps) {
  const { items, updateCantidad, removeItem, clear } = useCart()

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
              <p className="text-sm text-slate-600">{formatPrecio(item.precio)} c/u + IVA</p>
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

      {/* El carrito se conserva en localStorage mientras el cliente entra o se registra, y
          ?redirect=/carrito lo regresa aquí al terminar. */}
      <CheckoutForm user={user} lineas={items} redirectPath="/carrito" onPedidoCreado={clear} />
    </div>
  )
}
