type VideoPlaceholderProps = {
  texto: string
  className?: string
}

export function VideoPlaceholder({ texto, className = 'h-64 md:h-80' }: VideoPlaceholderProps) {
  return (
    <section className={`relative flex items-center justify-center overflow-hidden bg-slate-800 ${className}`}>
      <span className="absolute right-6 top-6 z-10 text-sm font-bold tracking-widest text-white/70">
        VIDEO
      </span>
      <div className="absolute inset-0 flex items-center justify-center border border-dashed border-white/20 px-6 text-center text-sm text-white/40">
        {texto}
      </div>
    </section>
  )
}
