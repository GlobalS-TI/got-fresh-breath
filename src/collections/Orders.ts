import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

// Límite de dispensadores para usuarios no-empresa / no-distribuidor.
// Única fuente de verdad — cualquier validación de UI (ej. carrito) debe importar esto, no repetir "2".
export const MAX_DISPENSADORES_INDIVIDUAL = 2

// Fuerza el estado inicial a 'pendiente' — nunca confiar en un estado mandado por el cliente
const enforceInitialStatus: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create') {
    data.estado = 'pendiente'
  }
  return data
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'usuario', 'total', 'estado', 'createdAt'],
    group: 'Tienda',
  },
  hooks: {
    beforeChange: [enforceInitialStatus],
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
