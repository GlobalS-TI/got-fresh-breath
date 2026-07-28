import Link from 'next/link'
import { redirect } from 'next/navigation'

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

function formatPrecio(precio: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(precio)
}

function formatFecha(fecha: string) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(fecha))
}

export const metadata = {
  title: 'Mis pedidos - Got Fresh Breath',
}

export default async function PedidosPage() {
  const user = await getSession()
  if (!user) {
    redirect('/login?redirect=/cuenta/pedidos')
  }

  const payload = await getPayloadClient()
  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: { usuario: { equals: user.id } },
    sort: '-createdAt',
    limit: 50,
    overrideAccess: false,
    user,
  })

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Mis pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-slate-600">
          Aún no tienes pedidos.{' '}
          <Link href="/tienda" className="font-semibold text-brand-600 hover:underline">
            Ir a la tienda
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/pedido/${order.id}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:border-brand-300"
            >
              <div>
                <p className="font-semibold text-slate-900">Pedido #{order.id}</p>
                <p className="text-sm text-slate-600">{formatFecha(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatPrecio(order.total)}</p>
                <p className="text-sm text-slate-600">{ESTADO_LABELS[order.estado] ?? order.estado}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
