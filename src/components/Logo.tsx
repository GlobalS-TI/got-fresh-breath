type LogoProps = {
  // Variante clara para cuando el nav está transparente sobre el hero (fondo azul)
  light?: boolean
}

export function Logo({ light = false }: LogoProps) {
  return (
    <span className="text-xl font-semibold tracking-tight">
      <span className={light ? 'text-white/80' : 'text-slate-500'}>got</span>
      <span className={light ? 'text-white' : 'text-brand-500'}>fresh</span>
      <span className={light ? 'text-white/80' : 'text-slate-700'}>breath?</span>
    </span>
  )
}
