import { MediaSlot } from '@/components/MediaSlot'
import type { Media } from '@/payload-types'

type VideoPlaceholderProps = {
  texto: string
  className?: string
  media?: Media | null
}

export function VideoPlaceholder({ texto, className = 'h-64 md:h-80', media = null }: VideoPlaceholderProps) {
  return (
    <section className={`relative flex items-center justify-center overflow-hidden bg-slate-800 ${className}`}>
      {!media && (
        <span className="absolute right-6 top-6 z-10 text-sm font-bold tracking-widest text-white/70">
          VIDEO
        </span>
      )}
      <MediaSlot
        media={media}
        fallbackLabel={texto}
        className="absolute inset-0 flex items-center justify-center border border-dashed border-white/20 px-6 text-center text-sm text-white/40"
        mediaClassName="absolute inset-0 h-full w-full object-cover"
      />
    </section>
  )
}
