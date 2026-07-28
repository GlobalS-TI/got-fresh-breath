import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { getSession } from '@/lib/session'

const ESTADO_LABELS: Record<string, string> = {
  pendiente: 'Pendiente de pago',
  pagado: 'Pagado',
  en_proceso: 'En proceso',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const METODO_PAGO_LABELS: Record<string, string> = {
  paypal: 'PayPal',
  transferencia: 'Transferencia bancaria',
  cotizacion: 'Solicitud de cotización',
}

function formatPrecio(precio: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await params
  const { token } = await searchParams
  const orderId = Number(id)
  if (!Number.isFinite(orderId)) {
    notFound()
  }

  const user = await getSession()
  const payload = await getPayloadClient()

  const order = await payload.findByID({ collection: 'orders', id: orderId, overrideAccess: true }).catch(() => null)
  if (!order) {
    notFound()
  }

  const ownerId = typeof order.usuario === 'object' ? order.usuario?.id : order.usuario
  // Los pedidos de invitado (sin usuario) requieren el token opaco de la URL - el ID secuencial
  // por sí solo NO alcanza para verlos, así que no se pueden enumerar probando IDs consecutivos.
  // Los pedidos con cuenta requieren ser el dueño o admin.
  //
  // `ownerId` es `undefined` (no `null`) cuando el pedido es de invitado, porque Payload omite la
  // clave `usuario` del todo si la relación está vacía. Sin `ownerId != null`, un visitante sin
  // sesión (`user?.id` también `undefined`) pasaría la comparación `undefined === undefined`.
  const esInvitado = !ownerId
  const tokenValido = esInvitado && Boolean(token) && token === order.accessToken
  const esDueño = ownerId != null && user?.id === ownerId
  const puedeVer = tokenValido || user?.rol === 'admin' || esDueño
  if (!puedeVer) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">¡Gracias por tu pedido!</h1>
      <p className="mb-8 text-slate-600">
        Pedido #{order.id} - {ESTADO_LABELS[order.estado] ?? order.estado}
      </p>

      <div className="mb-8 flex flex-col gap-4">
        {order.items.map((item, idx) => {
          const producto = typeof item.producto === 'object' ? item.producto : null
          return (
            <div
              key={item.id ?? idx}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
            >
              <div>
                <p className="font-semibold text-slate-900">{producto?.nombre ?? `Producto #${item.producto}`}</p>
                <p className="text-sm text-slate-600">
                  {item.cantidad} × {formatPrecio(item.precioUnitario)}
                </p>
              </div>
              <p className="font-semibold text-slate-900">{formatPrecio(item.cantidad * item.precioUnitario)}</p>
            </div>
          )
        })}
      </div>

      <p className="mb-8 text-right text-xl font-bold text-slate-900">Total: {formatPrecio(order.total)}</p>

      <div className="mb-8 rounded-lg border border-slate-200 p-6 text-sm text-slate-700">
        <p className="mb-2">
          <span className="font-semibold">Método de pago: </span>
          {order.metodoPago ? METODO_PAGO_LABELS[order.metodoPago] : 'Por definir'}
        </p>
        {order.metodoPago === 'cotizacion' && (
          <p className="text-slate-600">Nuestro equipo se pondrá en contacto contigo para confirmar el pago.</p>
        )}
        {order.metodoPago === 'transferencia' && (
          <p className="text-slate-600">
            Te enviaremos los datos bancarios por correo para completar tu transferencia.
          </p>
        )}
      </div>

      <Link href="/tienda" className="font-semibold text-brand-600 hover:underline">
        Seguir comprando
      </Link>
    </div>
  )
}
