'use client'

import { createClientUploadHandler, getFileKey } from '@payloadcms/plugin-cloud-storage/client'
import { upload } from '@vercel/blob/client'
import { formatAdminURL } from 'payload/shared'

import { MAX_MEDIA_FILE_SIZE_BYTES } from '@/lib/mediaLimits'

type Extra = {
  addRandomSuffix: boolean
  useCompositePrefixes: boolean
}

function posixBasename(key: string) {
  const normalized = key.replace(/^\/+/, '')
  const lastSlash = normalized.lastIndexOf('/')
  return lastSlash === -1 ? normalized : normalized.slice(lastSlash + 1)
}

// Agrega un sufijo corto y aleatorio antes de la extensión: "foto.png" → "foto-k3x9q2.png".
function nombreUnico(nombre: string) {
  const sufijo = Math.random().toString(36).slice(2, 8)
  const punto = nombre.lastIndexOf('.')
  return punto > 0 ? `${nombre.slice(0, punto)}-${sufijo}${nombre.slice(punto)}` : `${nombre}-${sufijo}`
}

// Reimplementación de @payloadcms/storage-vercel-blob's VercelBlobClientUploadHandler con
// `multipart: true`. El handler del plugin sube el archivo en un solo PUT directo a
// vercel.com/api/blob, que tiene el mismo límite de ~4.5MB que las funciones serverless de
// Vercel — cualquier video o imagen más pesada falla con 400 Bad Request. El endpoint del
// servidor es el mismo que ya registra el plugin (no le importa el flag multipart), así que
// solo hace falta cambiar el comportamiento del lado del cliente.
export const MediaMultipartUploadHandler = createClientUploadHandler<Extra>({
  handler: async ({ apiRoute, collectionSlug, docPrefix, extra, file, prefix, serverHandlerPath, serverURL, updateFilename }) => {
    if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
      throw new Error(
        `El archivo pesa ${(file.size / (1024 * 1024)).toFixed(1)}MB, que excede el límite de ${MAX_MEDIA_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
      )
    }

    const endpointRoute = formatAdminURL({
      apiRoute,
      path: serverHandlerPath,
      serverURL,
    })

    // El archivo se sube a Blob con un nombre que no puede chocar con otro documento de Media. Si
    // se subiera con `file.name` tal cual y ese nombre ya existe en la base (p. ej. al reemplazar
    // el archivo de un documento por otro con el mismo nombre), Payload renombra el documento a
    // "foto-1.png" en el servidor (`getSafeFileName`), pero el archivo ya quedó en Blob como
    // "foto.png" y el plugin no lo vuelve a subir — la base y Blob quedan desfasados y
    // /api/media/file/... responde 404. `updateFilename` le avisa a Payload el nombre final.
    const filename = nombreUnico(file.name)
    updateFilename(filename)

    const { fileKey: pathname, sanitizedDocPrefix } = getFileKey({
      collectionPrefix: prefix,
      docPrefix,
      filename,
      useCompositePrefixes: extra.useCompositePrefixes,
    })

    const result = await upload(pathname, file, {
      access: 'public',
      clientPayload: collectionSlug,
      contentType: file.type,
      handleUploadUrl: endpointRoute,
      multipart: true,
    })

    if (extra.addRandomSuffix) {
      updateFilename(decodeURIComponent(posixBasename(result.pathname.replace(/^\/+/, ''))))
    }

    return { prefix: sanitizedDocPrefix }
  },
})
