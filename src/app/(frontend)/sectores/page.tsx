import { ProgramaSection } from '@/components/ProgramaSection'
import { SectoresClient } from '@/components/SectoresClient'
import { SectoresGrid } from '@/components/SectoresGrid'
import { SolucionesGrid } from '@/components/SolucionesGrid'
import { VideoPlaceholder } from '@/components/VideoPlaceholder'

export const metadata = {
  title: 'Sectores — Got Fresh Breath',
}

export default function SectoresPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <SectoresGrid />
        <SolucionesGrid />
      </div>

      <VideoPlaceholder texto="Video — agua en movimiento (pendiente del cliente)" />

      <div
        id="elige-tu-sector"
        className="scroll-mt-16 bg-gradient-to-b from-brand-400 to-brand-600 px-6 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <SectoresClient />
        </div>
      </div>

      <ProgramaSection />
    </>
  )
}
