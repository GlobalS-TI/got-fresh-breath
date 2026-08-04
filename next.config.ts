import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// CSP escopeado solo al frontend público (excluye /admin y /api) para no arriesgar romper el
// admin panel de Payload, que suele necesitar 'unsafe-inline'/'unsafe-eval' y orígenes dinámicos
// que no vale la pena tratar de anticipar sin poder probarlo visualmente en un navegador.
//
// 'unsafe-eval' solo se agrega en dev: Next/React lo usan para HMR y para reconstruir stack
// traces del overlay de errores. React nunca usa eval() en producción, así que en build de
// producción se omite y el CSP queda más estricto.
const FRONTEND_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''} https://www.paypal.com https://www.paypalobjects.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "media-src 'self' https:",
  "font-src 'self' data:",
  "frame-src 'self' https://www.google.com https://www.paypal.com https://www.sandbox.paypal.com",
  "connect-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://www.paypal.com",
  "frame-ancestors 'self'",
].join('; ')

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Headers seguros de aplicar a todo el sitio, incluyendo /admin y /api.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        ],
      },
      {
        // CSP solo en rutas del frontend público — no en /admin ni /api.
        source: '/((?!admin|api).*)',
        headers: [{ key: 'Content-Security-Policy', value: FRONTEND_CSP }],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
