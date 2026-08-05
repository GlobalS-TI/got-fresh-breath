'use client'

import { createClientUploadHandler, getFileKey } from '@payloadcms/plugin-cloud-storage/client'
import { upload } from '@vercel/blob/client'
import { formatAdminURL } from 'payload/shared'

type Extra = {
  addRandomSuffix: boolean
  useCompositePrefixes: boolean
}

function posixBasename(key: string) {
  const normalized = key.replace(/^\/+/, '')
  const lastSlash = normalized.lastIndexOf('/')
  return lastSlash === -1 ? normalized : normalized.slice(lastSlash + 1)
}

// Reimplementación de @payloadcms/storage-vercel-blob's VercelBlobClientUploadHandler con
// `multipart: true`. El handler del plugin sube el archivo en un solo PUT directo a
// vercel.com/api/blob, que tiene el mismo límite de ~4.5MB que las funciones serverless de
// Vercel — cualquier video o imagen más pesada falla con 400 Bad Request. El endpoint del
// servidor es el mismo que ya registra el plugin (no le importa el flag multipart), así que
// solo hace falta cambiar el comportamiento del lado del cliente.
export const MediaMultipartUploadHandler = createClientUploadHandler<Extra>({
  handler: async ({ apiRoute, collectionSlug, docPrefix, extra, file, prefix, serverHandlerPath, serverURL, updateFilename }) => {
    const endpointRoute = formatAdminURL({
      apiRoute,
      path: serverHandlerPath,
      serverURL,
    })

    const { fileKey: pathname, sanitizedDocPrefix } = getFileKey({
      collectionPrefix: prefix,
      docPrefix,
      filename: file.name,
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
