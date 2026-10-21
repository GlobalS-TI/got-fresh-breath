'use client'

import { useMemo, useState } from 'react'

import { CheckoutForm, type LineaCheckout } from '@/components/CheckoutForm'
import type { CheckoutUser } from '@/lib/checkout-user'
import {
  type ColorDispensador,
  type PaqueteConsultorio,
  slugDePaquete,
} from '@/lib/productos-consultorios'

import styles from './consultorios.module.css'

export type ProductoLanding = Omit<LineaCheckout, 'cantidad'> & { slug: string }

type PedidoFormProps = {
  user: CheckoutUser | null
  productos: ProductoLanding[]
  inicial: { paquete: PaqueteConsultorio; color: ColorDispensador; cantidad: number }
  whatsappUrl: string
}

const MAX_CANTIDAD = 99

// El cliente elige paquete/color/cantidad y paga con el mismo CheckoutForm de /carrito — no hay
// checkout aparte para la landing. La selección viaja en el ?redirect de login/registro para que
// el cliente regrese con el mismo paquete elegido.
export function PedidoForm({ user, productos, inicial, whatsappUrl }: PedidoFormProps) {
  const [paquete, setPaquete] = useState<PaqueteConsultorio>(inicial.paquete)
  const [color, setColor] = useState<ColorDispensador>(inicial.color)
  const [cantidad, setCantidad] = useState(inicial.cantidad)

  const producto = productos.find((p) => p.slug === slugDePaquete(paquete, color))
  // Referencia estable: CheckoutForm la usa en forceReRender de los botones de PayPal.
  const lineas = useMemo(() => (producto ? [{ ...producto, cantidad }] : []), [producto, cantidad])

  if (productos.length === 0) {
    return (
      <div className={styles.formulario}>
        <p className={styles.pedidoLead}>
          Por el momento no podemos tomar pedidos en línea. Escríbenos por{' '}
          <a href={whatsappUrl}>WhatsApp</a> y con gusto te atendemos.
        </p>
      </div>
    )
  }

  const redirectPath = `/consultorios?${new URLSearchParams({
    paquete,
    color,
    cantidad: String(cantidad),
  })}#pedido`

  return (
    <div className={styles.pedidoColumna}>
      <div className={styles.formulario}>
        <div className={styles.campo}>
          <label htmlFor="paquete" className={styles.etiqueta}>
            Paquete
          </label>
          <select
            id="paquete"
            value={paquete}
            onChange={(e) => setPaquete(e.target.value as PaqueteConsultorio)}
            className={styles.control}
          >
            <option value="kit">Kit de inicio</option>
            <option value="paquete3">Paquete de 3 botellas</option>
            <option value="caja6">Caja completa (6 botellas)</option>
          </select>
        </div>
        {paquete === 'kit' && (
          <div className={styles.campo}>
            <label htmlFor="color" className={styles.etiqueta}>
              Color del dispensador
            </label>
            <select
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value as ColorDispensador)}
              className={styles.control}
            >
              <option value="blanco">Blanco</option>
              <option value="negro">Negro</option>
              <option value="niquel">Níquel (+$200)</option>
            </select>
          </div>
        )}
        <div className={styles.campo}>
          <label htmlFor="cantidad" className={styles.etiqueta}>
            Cantidad
          </label>
          <input
            id="cantidad"
            type="number"
            min={1}
            max={MAX_CANTIDAD}
            value={cantidad}
            onChange={(e) => setCantidad(Math.min(Math.max(1, Math.floor(Number(e.target.value)) || 1), MAX_CANTIDAD))}
            className={styles.control}
          />
        </div>
      </div>

      <div className={`${styles.checkout} gfb-checkout`}>
        {producto ? (
          <CheckoutForm user={user} lineas={lineas} redirectPath={redirectPath} />
        ) : (
          <p className={styles.pedidoLead}>
            Este paquete no está disponible por el momento. Escríbenos por{' '}
            <a href={whatsappUrl}>WhatsApp</a>.
          </p>
        )}
      </div>
    </div>
  )
}
