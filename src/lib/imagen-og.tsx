import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

export const TAMANO_OG = { width: 1200, height: 630 }

type ImagenOgProps = {
  titulo: string
  subtitulo: string
}

// Imagen que muestran WhatsApp, LinkedIn, Facebook, etc. al compartir un enlace del sitio. La usan
// los `opengraph-image.tsx` de (frontend) y de /consultorios con su propio texto.
export async function imagenOg({ titulo, subtitulo }: ImagenOgProps) {
  const logo = await readFile(join(process.cwd(), 'public/logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(180deg, #74c3e3 0%, #2f8bbd 100%)',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            padding: '20px 32px',
            borderRadius: 16,
            background: '#ffffff',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={291} height={59} alt="" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>{titulo}</div>
          <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.9)' }}>{subtitulo}</div>
        </div>

        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.85)' }}>gotfreshbreath.mx</div>
      </div>
    ),
    TAMANO_OG,
  )
}
