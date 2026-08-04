import { MediaSlot } from '@/components/MediaSlot'
import { getSiteMediaSlot } from '@/lib/siteMedia'

export async function NosotrosHero() {
  const video = await getSiteMediaSlot('nosotros.hero-agua')

  return (
    <section className="relative flex h-72 items-center justify-center overflow-hidden bg-slate-800 md:h-96">
      {!video && (
        <span className="absolute right-6 top-6 z-10 text-sm font-bold tracking-widest text-white/70">
          VIDEO
        </span>
      )}

      <MediaSlot
        media={video}
        fallbackLabel="Video - agua en movimiento (pendiente del cliente)"
        className="absolute inset-0 flex items-center justify-center border border-dashed border-white/20 px-6 text-center text-sm text-white/40"
        mediaClassName="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />

      <h1 className="relative z-10 max-w-md px-6 text-center text-2xl font-bold leading-snug text-white md:text-3xl">
        Equipamos la cultura de tu empresa
      </h1>
    </section>
  )
}
