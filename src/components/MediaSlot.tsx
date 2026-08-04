import type { Media } from '@/payload-types'

type MediaSlotProps = {
  media: Media | null | undefined
  fallbackLabel: string
  className?: string
  mediaClassName?: string
  videoProps?: {
    autoPlay?: boolean
    controls?: boolean
    loop?: boolean
    muted?: boolean
  }
}

const DEFAULT_VIDEO_PROPS = { autoPlay: true, loop: true, muted: true }

// Reemplaza un placeholder de foto/video por el archivo real subido en
// /admin/globals/site-media, si existe. Si no hay archivo para ese slot,
// renderiza el mismo bloque punteado de "pendiente del cliente" de siempre.
// Usa <img>/<video> planos (no next/image) para no depender de configurar
// remotePatterns por cada dominio de storage (local hoy, Vercel Blob en prod).
export function MediaSlot({ media, fallbackLabel, className, mediaClassName, videoProps }: MediaSlotProps) {
  if (media?.url) {
    if (media.mimeType?.startsWith('video/')) {
      const finalVideoProps = { ...DEFAULT_VIDEO_PROPS, ...videoProps }
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={media.url} className={mediaClassName} playsInline {...finalVideoProps} />
      )
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.url} alt={media.alt || fallbackLabel} className={mediaClassName} />
    )
  }

  return <div className={className}>{fallbackLabel}</div>
}
