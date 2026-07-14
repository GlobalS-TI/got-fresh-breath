import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Clients } from './collections/Clients'
import { Leads } from './collections/Leads'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// El frontend y el admin panel viven en el mismo origen (un solo Next.js app) — no hay necesidad
// de exponer la API REST/GraphQL a otros orígenes. Restringido para reducir superficie de ataque
// (ej. otro sitio haciendo requests autenticadas usando la cookie payload-token del navegador).
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Orders, Clients, Leads],
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
  plugins: [],
})
