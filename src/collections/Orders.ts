import { randomUUID } from 'crypto'
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { escapeHtml, NOTIFICATION_EMAIL, sendEmail } from '@/lib/email'

export { MAX_DISPENSADORES_INDIVIDUAL } from '@/lib/constants'

// Fuerza el estado inicial — nunca confiar en `data.estado` mandado por el cliente, ya que
// `access.create` es público (cualquiera podría intentar un POST directo con estado:"pagado").
// `context.paymentVerified` solo lo puede fijar nuestro propio server action (capturePaypalOrderAction)
// después de confirmar la captura con la API de PayPal — no viene del body de la request pública,
// así que un caller externo no puede falsificarlo.
const enforceInitialStatus: CollectionBeforeChangeHook = ({ data, operation, context }) => {
  if (operation === 'create') {
    data.estado = context?.paymentVerified === true ? 'pagado' : 'pendiente'
  }
  return data
}

// Token opaco para que un invitado (sin cuenta) pueda ver la confirmación de SU pedido en
// /pedido/[id] sin que el ID secuencial permita enumerar/ver pedidos de otros invitados.
const generateAccessToken: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create') {
    data.accessToken = randomUUID()
  }
  return data
}

const notifyNewOrder: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  let clienteEmail = doc.guestEmail as string | null | undefined
  if (!clienteEmail && doc.usuario) {
    const usuarioId = typeof doc.usuario === 'object' ? doc.usuario.id : doc.usuario
    const usuario = await req.payload.findByID({ collection: 'users', id: usuarioId }).catch(() => null)
    clienteEmail = usuario?.email
  }

  const itemsHtml = doc.items
    .map(
      (item: { cantidad: number; precioUnitario: number }) =>
        `<li>${item.cantidad} × $${item.precioUnitario} MXN</li>`,
    )
    .join('')

  await sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: `Nuevo pedido #${doc.id} — $${doc.total} MXN`,
    html: `
      <h2>Nuevo pedido recibido</h2>
      <p><strong>Pedido:</strong> #${doc.id}</p>
      <p><strong>Cliente:</strong> ${escapeHtml(clienteEmail) || 'desconocido'}</p>
      <p><strong>Total:</strong> $${doc.total} MXN</p>
      <p><strong>Método de pago:</strong> ${escapeHtml(doc.metodoPago) || 'por definir'}</p>
      <ul>${itemsHtml}</ul>
    `,
  })

  if (clienteEmail) {
    await sendEmail({
      to: clienteEmail,
      subject: `Confirmación de tu pedido #${doc.id} — Got Fresh Breath`,
      html: `
        <h2>¡Gracias por tu pedido!</h2>
        <p>Recibimos tu pedido #${doc.id} por un total de $${doc.total} MXN.</p>
        <ul>${itemsHtml}</ul>
        <p>Nuestro equipo se pondrá en contacto contigo para confirmar el pago y envío.</p>
      `,
    })
  }

  return doc
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'usuario', 'total', 'estado', 'createdAt'],
    group: 'Tienda',
  },
  hooks: {
    beforeChange: [enforceInitialStatus, generateAccessToken],
    afterChange: [notifyNewOrder],
  },
  fields: [
    { name: 'usuario', type: 'relationship', relationTo: 'users', required: false, label: 'Usuario' },
    {
      name: 'guestEmail',
      type: 'email',
      label: 'Email (compra como invitado)',
      admin: { condition: (_, { usuario }) => !usuario },
    },
    {
      name: 'accessToken',
      type: 'text',
      unique: true,
      label: 'Token de acceso (invitado)',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Generado automáticamente — permite a un invitado ver su pedido sin cuenta.',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'producto', type: 'relationship', relationTo: 'products', required: true },
        { name: 'cantidad', type: 'number', required: true, min: 1 },
        { name: 'precioUnitario', type: 'number', required: true, label: 'Precio unitario al momento de la compra' },
      ],
    },
    { name: 'total', type: 'number', required: true, label: 'Total (MXN)' },
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'pendiente',
      options: [
        { label: 'Pendiente de pago', value: 'pendiente' },
        { label: 'Pagado', value: 'pagado' },
        { label: 'En proceso', value: 'en_proceso' },
        { label: 'Enviado', value: 'enviado' },
        { label: 'Entregado', value: 'entregado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
    },
    {
      name: 'metodoPago',
      type: 'select',
      label: 'Método de pago',
      options: [
        { label: 'PayPal', value: 'paypal' },
        { label: 'Transferencia', value: 'transferencia' },
        { label: 'Cotización', value: 'cotizacion' },
      ],
    },
    { name: 'paypalOrderId', type: 'text', label: 'PayPal Order ID' },
    {
      name: 'direccionEnvio',
      type: 'group',
      label: 'Dirección de envío',
      fields: [
        { name: 'calle', type: 'text' },
        { name: 'ciudad', type: 'text' },
        { name: 'estado', type: 'text' },
        { name: 'cp', type: 'text', label: 'Código postal' },
      ],
    },
    { name: 'notas', type: 'textarea', label: 'Notas internas' },
  ],
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.rol === 'admin') return true
      return { usuario: { equals: req.user.id } }
    },
    create: () => true,
    update: ({ req }) => req.user?.rol === 'admin',
    delete: ({ req }) => req.user?.rol === 'admin',
  },
}
