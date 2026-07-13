import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'activo', 'orden'],
    group: 'Contenido',
  },
  fields: [
    { name: 'nombre', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'activo', type: 'checkbox', defaultValue: true },
    { name: 'orden', type: 'number', defaultValue: 0, label: 'Orden de aparición' },
  ],
  access: {
    read: () => true,
    create: ({ req }) => req.user?.rol === 'admin',
    update: ({ req }) => req.user?.rol === 'admin',
    delete: ({ req }) => req.user?.rol === 'admin',
  },
}
