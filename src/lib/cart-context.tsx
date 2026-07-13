'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartItem = {
  productId: number
  slug: string
  nombre: string
  precio: number
  cantidad: number
  imagenUrl?: string | null
  categoria: 'dispensador' | 'consumible'
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'cantidad'>, cantidad?: number) => void
  removeItem: (productId: number) => void
  updateCantidad: (productId: number, cantidad: number) => void
  clear: () => void
  count: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)
// v2: agrega `categoria` a CartItem. Cambiar la clave descarta carritos con el shape viejo en
// vez de hidratarlos a medias (ej. categoria undefined, que rompería el chequeo de límite).
const STORAGE_KEY = 'gfb-cart-v2'
const MAX_CANTIDAD_POR_ITEM = 99

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CartItem>
  return (
    typeof item.productId === 'number' &&
    typeof item.cantidad === 'number' &&
    (item.categoria === 'dispensador' || item.categoria === 'consumible')
  )
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.every(isValidCartItem)) {
          setItems(parsed)
        }
      }
    } catch {
      // localStorage corrupto o inaccesible — arrancar con carrito vacío
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem = useCallback((item: Omit<CartItem, 'cantidad'>, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      if (existing) {
        const nuevaCantidad = Math.min(existing.cantidad + cantidad, MAX_CANTIDAD_POR_ITEM)
        return prev.map((i) => (i.productId === item.productId ? { ...i, cantidad: nuevaCantidad } : i))
      }
      return [...prev, { ...item, cantidad: Math.min(cantidad, MAX_CANTIDAD_POR_ITEM) }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const updateCantidad = useCallback((productId: number, cantidad: number) => {
    setItems((prev) =>
      cantidad < 1
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId ? { ...i, cantidad: Math.min(cantidad, MAX_CANTIDAD_POR_ITEM) } : i,
          ),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.cantidad, 0), [items])
  const total = useMemo(() => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateCantidad, clear, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
