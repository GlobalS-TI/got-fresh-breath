import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig, type Config, type Plugin } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Clients } from './collections/Clients'
import { Leads } from './collections/Leads'
import { SiteMedia } from './globals/SiteMedia'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// El frontend y el admin panel viven en el mismo origen (un solo Next.js app) — no hay necesidad
// de exponer la API REST/GraphQL a otros orígenes. Restringido para reducir superficie de ataque
// (ej. otro sitio haciendo requests autenticadas usando la cookie payload-token del navegador).
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// @payloadcms/storage-vercel-blob's client-upload handler always does a single PUT direct to
// vercel.com/api/blob, which is capped at ~4.5MB (same platform-wide limit as a serverless
// function body) — no config option to request a multipart upload instead. This plugin
// registers our own handler (src/components/admin/MediaMultipartUploadHandler.tsx) for the
// `media` collection, which reuses the same server-side token route but requests
// `multipart: true` on the client.
//
// admin.components.providers gets nested via recursion (see @payloadcms/next's
// NestProviders.js): providers[0] ends up OUTERMOST, wrapping providers[1], which wraps
// providers[2], etc. React fires child effects before parent effects, so the INNERMOST
// provider's `useEffect` (which is where the upload handler actually gets registered) runs
// FIRST and the OUTERMOST runs LAST — meaning whichever provider is pushed EARLIER in the
// array wins (its registration overwrites the others', since it fires last). That's why this
// plugin must run — and therefore push its provider — BEFORE vercelBlobStorage in the plugins
// array below.
const withMediaMultipartUploads: Plugin = (incomingConfig: Config): Config => {
  const admin = incomingConfig.admin ?? {}
  const components = admin.components ?? {}
  const providers = components.providers ?? []

  return {
    ...incomingConfig,
    admin: {
      ...admin,
      components: {
        ...components,
        providers: [
          ...providers,
          {
            clientProps: {
              collectionSlug: 'media',
              enabled: true,
              extra: { addRandomSuffix: false, useCompositePrefixes: false },
              serverHandlerPath: '/vercel-blob-client-upload-route',
            },
            path: '/components/admin/MediaMultipartUploadHandler#MediaMultipartUploadHandler',
          },
        ],
      },
    },
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Orders, Clients, Leads],
  globals: [SiteMedia],
  editor: lexicalEditor(),
  cors: [SERVER_URL],
  csrf: [SERVER_URL],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    // Sin BLOB_READ_WRITE_TOKEN (ej. en local) cae de vuelta al disco local
    // configurado en Media.ts — solo se activa cuando el proyecto está
    // conectado a un Vercel Blob store.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          withMediaMultipartUploads,
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
            // Sube el archivo directo del navegador a Blob, sin pasar por la función
            // serverless — Vercel limita el body de una función a 4.5MB, insuficiente
            // para videos.
            clientUploads: true,
          }),
        ]
      : []),
  ],
})
