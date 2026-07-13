import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'precio', 'categoria', 'activo'],
    group: 'Tienda',
  },
  fields: [
    { name: 'nombre', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL del producto, ej: dispensador-slim-nickel' },
    },
    { name: 'descripcion', type: 'textarea', required: true },
    { name: 'descripcionCorta', type: 'text', label: 'Descripción corta (para cards)' },
    { name: 'precio', type: 'number', required: true, label: 'Precio (MXN)', min: 0 },
    {
      name: 'categoria',
      type: 'select',
      required: true,
      options: [
        { label: 'Dispensador', value: 'dispensador' },
        { label: 'Consumible', value: 'consumible' },
      ],
    },
    {
      name: 'imagenes',
      type: 'array',
      label: 'Imágenes',
      fields: [{ name: 'imagen', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'fichaTecnica',
      type: 'upload',
      relationTo: 'media',
      label: 'Ficha técnica (PDF)',
    },
    { name: 'stock', type: 'number', defaultValue: 0, min: 0 },
    { name: 'activo', type: 'checkbox', defaultValue: true, label: 'Visible en tienda' },
  ],
  access: {
    read: () => true,
    create: ({ req }) => req.user?.rol === 'admin',
    update: ({ req }) => req.user?.rol === 'admin',
    delete: ({ req }) => req.user?.rol === 'admin',
  },
}
