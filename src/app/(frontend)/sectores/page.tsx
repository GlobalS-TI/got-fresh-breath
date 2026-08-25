import { ProgramaSection } from '@/components/ProgramaSection'
import { SectoresClient } from '@/components/SectoresClient'
import { SectoresGrid } from '@/components/SectoresGrid'
import { SolucionesGrid } from '@/components/SolucionesGrid'
import { VideoPlaceholder } from '@/components/VideoPlaceholder'
import { getSiteMediaMap } from '@/lib/siteMedia'

export const metadata = {
  title: 'Sectores - Got Fresh Breath',
}

const SECTOR_VALUES = ['hoteles', 'restaurantes', 'corporativos', 'salud', 'comercial', 'hogar']

export default async function SectoresPage() {
  const mediaMap = await getSiteMediaMap()
  const sectoresMedia = Object.fromEntries(
    SECTOR_VALUES.map((value) => [value, mediaMap[`sectores.${value}`] ?? null]),
  )

  return (
    <>
      <div
        id="elige-tu-sector"
        className="scroll-mt-16 bg-linear-to-b from-brand-400 to-brand-600 px-6 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <SectoresClient sectoresMedia={sectoresMedia} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <SolucionesGrid />
      </div>

      <ProgramaSection />
    </>
  )
}
