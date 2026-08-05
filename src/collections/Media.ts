import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { MAX_MEDIA_FILE_SIZE_BYTES } from '../lib/mediaLimits'

// Respaldo del lado del servidor al límite que ya aplica el cliente en
// MediaMultipartUploadHandler.tsx — cubre local dev (sin Blob, sube a disco)
// y cualquier creación por API/GraphQL que no pase por el admin panel.
const enforceMaxFileSize: CollectionBeforeValidateHook = ({ data }) => {
  if (typeof data?.filesize === 'number' && data.filesize > MAX_MEDIA_FILE_SIZE_BYTES) {
    throw new APIError(
      `El archivo pesa ${(data.filesize / (1024 * 1024)).toFixed(1)}MB, que excede el límite de ${MAX_MEDIA_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
      400,
    )
  }
  return data
}

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
  hooks: {
    beforeValidate: [enforceMaxFileSize],
  },
  fields: [{ name: 'alt', type: 'text', label: 'Texto alternativo' }],
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => req.user?.rol === 'admin',
    delete: ({ req }) => req.user?.rol === 'admin',
  },
}
