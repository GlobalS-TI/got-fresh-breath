import Image from 'next/image'

type LogoProps = {
  // Variante clara para cuando el nav está transparente sobre el hero (fondo azul)
  light?: boolean
}

export function LogoGlobal({ light = false }: LogoProps) {
  return (
    <Image
      src="/logo-global.png"
      alt="Global Supplier"
      width={280}
      height={55}
      className={`h-8 w-auto ${light ? 'brightness-0 invert' : ''}`}
      priority
    />
  )
}
