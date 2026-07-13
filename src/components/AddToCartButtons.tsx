'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCart } from '@/lib/cart-context'

type AddToCartButtonsProps = {
  productId: number
  slug: string
  nombre: string
  precio: number
  categoria: 'dispensador' | 'consumible'
  imagenUrl?: string | null
  showQuantity?: boolean
}

const CANTIDADES = Array.from({ length: 10 }, (_, i) => i + 1)

export function AddToCartButtons({
  productId,
  slug,
  nombre,
  precio,
  categoria,
  imagenUrl,
  showQuantity = false,
}: AddToCartButtonsProps) {
  const { addItem } = useCart()
  const [cantidad, setCantidad] = useState(1)
  const [added, setAdded] = useState(false)
  const router = useRouter()

  function handleAdd() {
    addItem({ productId, slug, nombre, precio, categoria, imagenUrl }, cantidad)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleBuyNow() {
    addItem({ productId, slug, nombre, precio, categoria, imagenUrl }, cantidad)
    router.push('/carrito')
  }

  return (
    <div className="flex flex-col gap-2">
      {showQuantity && (
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Cantidad
          <select
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-32 rounded-md border border-slate-300 px-3 py-2"
          >
            {CANTIDADES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-md border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          {added ? 'Agregado ✓' : 'Agregar al carrito'}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Compra ahora
        </button>
      </div>
    </div>
  )
}
