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
    { name: 'precio', type: 'number', required: true, label: 'Precio (MXN, sin IVA)', min: 0 },
    {
      name: 'costoEnvio',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Costo de envío por unidad (MXN, sin IVA)',
      admin: { description: 'Se cobra por cada unidad del producto en el pedido. El IVA se suma en el checkout.' },
    },
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
      // Para productos cuyas fotos viven en el repo (public/), p. ej. los kits de /consultorios:
      // se sirven con el deploy y no necesitan storage externo. Solo se usa si no hay imágenes
      // arriba (ver imagenesDeProducto en src/lib/producto-imagen.ts).
      name: 'imagenEstatica',
      type: 'text',
      label: 'Imagen estática (ruta en /public)',
      admin: { description: 'Ej: /consultorios/blanco.png. Se usa solo si el producto no tiene imágenes subidas.' },
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
