'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useMemo, useRef, useState } from 'react'

import { checkoutAction, type CheckoutState } from '@/actions/checkout'
import { AvisoPrivacidadNotice } from '@/components/AvisoPrivacidadNotice'
import type { LineaCheckout } from '@/components/CheckoutForm'
import { type Direccion, PaypalCheckout } from '@/components/PaypalCheckout'
import type { CheckoutUser } from '@/lib/checkout-user'
import { MAX_DISPENSADORES_INDIVIDUAL } from '@/lib/constants'
import { REGIMENES_FISCALES, USOS_CFDI } from '@/lib/datos-fiscales'
import { calcularTotales, formatPrecio } from '@/lib/precios'
import {
  type ColorDispensador,
  type PaqueteConsultorio,
  slugDePaquete,
} from '@/lib/productos-consultorios'

import styles from './consultorios.module.css'

export type ProductoLanding = Omit<LineaCheckout, 'cantidad'> & { slug: string }

// Datos de la cuenta que el formulario muestra (nombre, consultorio, WhatsApp, correo).
export type ContactoCliente = { nombre: string; consultorio: string; telefono: string; email: string }

type PedidoFormProps = {
  user: CheckoutUser | null
  contacto: ContactoCliente | null
  productos: ProductoLanding[]
  inicial: { paquete: PaqueteConsultorio; color: ColorDispensador; cantidad: number }
  whatsappUrl: string
}

const MAX_CANTIDAD = 99
const initialState: CheckoutState = {}

// Formulario con el diseño original de la landing, pero el pedido se crea con el checkout del
// sitio: mismos server actions (checkoutAction / PayPal), mismo PaypalCheckout y mismos totales
// (calcularTotales) que /carrito. Nombre, consultorio, WhatsApp y correo salen de la cuenta.
export function PedidoForm({ user, contacto, productos, inicial, whatsappUrl }: PedidoFormProps) {
  const [paquete, setPaquete] = useState<PaqueteConsultorio>(inicial.paquete)
  const [color, setColor] = useState<ColorDispensador>(inicial.color)
  const [cantidad, setCantidad] = useState(inicial.cantidad)
  const [direccion, setDireccion] = useState<Direccion>({ calle: '', ciudad: '', estadoDireccion: '', cp: '' })
  const [requiereFactura, setRequiereFactura] = useState(false)
  const [state, formAction, pending] = useActionState(checkoutAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const producto = productos.find((p) => p.slug === slugDePaquete(paquete, color))
  // Referencias estables: PaypalCheckout las usa en forceReRender de los botones de PayPal.
  const lineas = useMemo(() => (producto ? [{ ...producto, cantidad }] : []), [producto, cantidad])
  const items = useMemo(() => lineas.map((l) => ({ productId: l.productId, cantidad: l.cantidad })), [lineas])

  useEffect(() => {
    if (state.success && state.orderId) {
      router.push(`/pedido/${state.orderId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  if (productos.length === 0) {
    return (
      <div className={styles.formulario}>
        <p className={styles.nota}>
          Por el momento no podemos tomar pedidos en línea. Escríbenos por{' '}
          <a href={whatsappUrl}>WhatsApp</a> y con gusto te atendemos.
        </p>
      </div>
    )
  }

  const totales = calcularTotales(lineas)
  const rol = user?.rol ?? 'individual'
  const dispensadores = lineas.filter((l) => l.categoria === 'dispensador').reduce((s, l) => s + l.cantidad, 0)
  const excedeLimite =
    rol !== 'empresa' && rol !== 'distribuidor' && dispensadores > MAX_DISPENSADORES_INDIVIDUAL
  const pideDatosFiscales = requiereFactura && !user?.rfcFacturacion
  const puedePedir = Boolean(user?.telefono) && Boolean(producto)

  const redirectPath = `/consultorios?${new URLSearchParams({
    paquete,
    color,
    cantidad: String(cantidad),
  })}#pedido`
  const authQuery = `?redirect=${encodeURIComponent(redirectPath)}`

  const campoDireccion = (campo: keyof Direccion, etiqueta: string, placeholder: string, ancho = false) => (
    <div className={`${styles.campo} ${ancho ? styles.ancho : ''}`}>
      <label htmlFor={campo} className={styles.etiqueta}>
        {etiqueta}
      </label>
      <input
        id={campo}
        name={campo}
        type="text"
        placeholder={placeholder}
        value={direccion[campo]}
        onChange={(e) => setDireccion((d) => ({ ...d, [campo]: e.target.value }))}
        className={styles.control}
      />
    </div>
  )

  return (
    <form ref={formRef} action={formAction} className={`${styles.formulario} gfb-checkout`}>
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      {contacto && (
        <>
          <div className={styles.campo}>
            <label htmlFor="nombre" className={styles.etiqueta}>
              Nombre
            </label>
            <input id="nombre" type="text" readOnly value={contacto.nombre} className={styles.control} />
          </div>
          <div className={styles.campo}>
            <label htmlFor="consultorio" className={styles.etiqueta}>
              Nombre del consultorio
            </label>
            <input
              id="consultorio"
              type="text"
              readOnly
              value={contacto.consultorio}
              placeholder="—"
              className={styles.control}
            />
          </div>
          <div className={styles.campo}>
            <label htmlFor="whatsapp" className={styles.etiqueta}>
              WhatsApp
            </label>
            <input id="whatsapp" type="tel" readOnly value={contacto.telefono} placeholder="—" className={styles.control} />
          </div>
          <div className={styles.campo}>
            <label htmlFor="correo" className={styles.etiqueta}>
              Correo
            </label>
            <input id="correo" type="email" readOnly value={contacto.email} className={styles.control} />
          </div>
          <p className={styles.nota}>
            Estos datos vienen de tu cuenta; puedes cambiarlos en <Link href="/cuenta">Mi cuenta</Link>.
          </p>

          {campoDireccion('calle', 'Calle y número', 'Av. Constitución 123', true)}
          {campoDireccion('ciudad', 'Ciudad', 'Monterrey')}
          {campoDireccion('estadoDireccion', 'Estado', 'Nuevo León')}
          {campoDireccion('cp', 'Código postal de entrega', '64000')}
        </>
      )}

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
      <div className={styles.campo}>
        <label htmlFor="color" className={styles.etiqueta}>
          Color del dispensador (kit)
        </label>
        <select
          id="color"
          value={color}
          disabled={paquete !== 'kit'}
          onChange={(e) => setColor(e.target.value as ColorDispensador)}
          className={styles.control}
        >
          <option value="blanco">Blanco</option>
          <option value="negro">Negro</option>
          <option value="niquel">Níquel (+$200)</option>
        </select>
      </div>
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
          onChange={(e) =>
            setCantidad(Math.min(Math.max(1, Math.floor(Number(e.target.value)) || 1), MAX_CANTIDAD))
          }
          className={styles.control}
        />
      </div>

      {contacto && (
        <>
          <div className={styles.campo}>
            <label htmlFor="requiereFactura" className={styles.etiqueta}>
              ¿Requiere factura?
            </label>
            <select
              id="requiereFactura"
              name="requiereFactura"
              value={requiereFactura ? 'on' : ''}
              onChange={(e) => setRequiereFactura(e.target.value === 'on')}
              className={styles.control}
            >
              <option value="on">Sí</option>
              <option value="">No</option>
            </select>
          </div>
          <div className={styles.campo}>
            <label htmlFor="metodoPago" className={styles.etiqueta}>
              Método de pago
            </label>
            <select id="metodoPago" name="metodoPago" defaultValue="cotizacion" className={styles.control}>
              <option value="cotizacion">Solicitar cotización</option>
              <option value="transferencia">Transferencia bancaria</option>
            </select>
          </div>

          {requiereFactura && user?.rfcFacturacion && (
            <p className={styles.nota}>
              Se facturará al RFC <strong>{user.rfcFacturacion}</strong>. Puedes cambiar tus datos fiscales
              en <Link href="/cuenta">Mi cuenta</Link>.
            </p>
          )}
          {pideDatosFiscales && (
            <>
              <p className={styles.subtituloFormulario}>Datos fiscales (se guardan en tu cuenta)</p>
              <div className={styles.campo}>
                <label htmlFor="rfc" className={styles.etiqueta}>
                  RFC
                </label>
                <input id="rfc" name="rfc" type="text" maxLength={13} className={styles.control} />
              </div>
              <div className={styles.campo}>
                <label htmlFor="razonSocial" className={styles.etiqueta}>
                  Razón social
                </label>
                <input id="razonSocial" name="razonSocial" type="text" className={styles.control} />
              </div>
              <div className={styles.campo}>
                <label htmlFor="regimenFiscal" className={styles.etiqueta}>
                  Régimen fiscal
                </label>
                <select id="regimenFiscal" name="regimenFiscal" defaultValue="" className={styles.control}>
                  <option value="">Selecciona…</option>
                  {REGIMENES_FISCALES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.campo}>
                <label htmlFor="usoCfdi" className={styles.etiqueta}>
                  Uso de CFDI
                </label>
                <select id="usoCfdi" name="usoCfdi" defaultValue="" className={styles.control}>
                  <option value="">Selecciona…</option>
                  {USOS_CFDI.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.campo}>
                <label htmlFor="cpFiscal" className={styles.etiqueta}>
                  Código postal fiscal
                </label>
                <input id="cpFiscal" name="cpFiscal" type="text" inputMode="numeric" maxLength={5} className={styles.control} />
              </div>
            </>
          )}
        </>
      )}

      {producto ? (
        <dl className={styles.resumen}>
          <div>
            <dt>Productos</dt>
            <dd>{formatPrecio(totales.subtotal)}</dd>
          </div>
          <div>
            <dt>Envío</dt>
            <dd>{formatPrecio(totales.envio)}</dd>
          </div>
          <div>
            <dt>IVA (16%)</dt>
            <dd>{formatPrecio(totales.iva)}</dd>
          </div>
          <div className={styles.resumenTotal}>
            <dt>Total</dt>
            <dd>{formatPrecio(totales.total)}</dd>
          </div>
        </dl>
      ) : (
        <p className={styles.nota}>
          Este paquete no está disponible por el momento. Escríbenos por <a href={whatsappUrl}>WhatsApp</a>.
        </p>
      )}

      {excedeLimite && (
        <p className={styles.aviso}>
          Como cliente individual, el máximo es {MAX_DISPENSADORES_INDIVIDUAL} dispensadores por pedido. Reduce la
          cantidad, o <Link href="/registro">regístrate como empresa</Link> para pedidos mayores.
        </p>
      )}

      {!user ? (
        <>
          <p className={styles.nota}>
            Para enviar tu pedido inicia sesión o crea tu cuenta: ahí guardamos tu nombre, consultorio,
            WhatsApp y correo para no volver a pedírtelos.
          </p>
          <div className={styles.acciones}>
            <Link href={`/login${authQuery}`} className={`${styles.boton} ${styles.botonHero}`}>
              Iniciar sesión
            </Link>
            <Link href={`/registro${authQuery}`} className={`${styles.botonContorno} ${styles.botonHero}`}>
              Crear cuenta
            </Link>
          </div>
        </>
      ) : !user.telefono ? (
        <p className={styles.aviso}>
          Agrega tu WhatsApp en <Link href="/cuenta">Mi cuenta</Link> para poder enviar tu pedido.
        </p>
      ) : (
        <>
          {state.error && <p className={styles.error}>{state.error}</p>}
          <div className={styles.ancho}>
            <AvisoPrivacidadNotice />
          </div>
          <button type="submit" disabled={pending || excedeLimite || !puedePedir} className={styles.enviar}>
            {pending ? 'Enviando…' : 'Enviar pedido'}
          </button>
          <div className={styles.paypal}>
            <PaypalCheckout
              items={items}
              direccion={direccion}
              requiereFactura={requiereFactura}
              formRef={formRef}
              disabled={excedeLimite || !puedePedir}
              className={{ titulo: styles.paypalTexto, aviso: styles.paypalTexto, error: styles.error }}
            />
          </div>
        </>
      )}
    </form>
  )
}
