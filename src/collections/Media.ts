import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Contenido',
  },
  upload: {
    staticDir: 'public/media',
    // SVG excluido: puede contener JS embebido (riesgo XSS si se sirve desde el mismo origen)
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'feature', width: 1280, height: 720, position: 'centre' },
    ],
  },
  fields: [{ name: 'alt', type: 'text', label: 'Texto alternativo' }],
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.rol === 'admin',
    delete: ({ req }) => req.user?.rol === 'admin',
  },
}
