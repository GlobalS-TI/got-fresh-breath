import Image from 'next/image'

type LogoProps = {
  // Variante clara para cuando el nav está transparente sobre el hero (fondo azul)
  light?: boolean
}

export function Logo({ light = false }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Got Fresh Breath"
      width={291}
      height={59}
      className={`h-48 w-auto ${light ? 'brightness-0 invert' : ''}`}
      priority
    />
  )
}
