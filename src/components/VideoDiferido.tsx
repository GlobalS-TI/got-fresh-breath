'use client'

import { useEffect, useRef } from 'react'

type VideoDiferidoProps = {
  src: string
  className?: string
}

// Video decorativo (mudo, en loop) que no se descarga hasta que está cerca de la pantalla:
// preload="none" evita bajar el archivo al cargar la página y el IntersectionObserver le da play
// al acercarse. Para videos debajo del primer pantallazo, sobre todo en celular.
export function VideoDiferido({ src, className }: VideoDiferidoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden
    />
  )
}
