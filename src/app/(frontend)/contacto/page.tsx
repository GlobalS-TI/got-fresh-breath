import { Clock, Globe, Mail, MapPin, Phone } from 'lucide-react'

import { LeadForm } from '@/components/LeadForm'
import { VideoPlaceholder } from '@/components/VideoPlaceholder'
import { getSiteMediaSlot } from '@/lib/siteMedia'

export const metadata = {
  title: 'Contacto - Got Fresh Breath',
}

export default async function ContactoPage() {
  const heroVideo = await getSiteMediaSlot('contacto.hero-agua')

  return (
    <>
      <VideoPlaceholder texto="Video - agua fluyendo (pendiente del cliente)" media={heroVideo} />

      <section className="relative overflow-hidden bg-gradient-to-b from-brand-400 to-brand-600 px-6 py-14">
        <h1 className="mx-auto max-w-2xl text-center text-2xl font-bold text-white md:text-3xl">
          Distribución Oficial en todo México y LATAM
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-white/85">
          Operamos con logística y soporte directo para asegurar que tu programa nunca se detenga, sin
          importar cuántos puntos de uso requiera tu organización.
        </p>

        <div className="relative mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-[3fr_2fr] md:items-center">
          <div className="flex flex-col gap-8 text-white">
            <div>
              <h2 className="mb-2 text-lg font-semibold">Línea Directa Corporativa</h2>
              <p className="flex items-center gap-2 text-white/90">
                <Phone className="h-4 w-4 shrink-0" />
                (81) 1680 9833
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">Consultoría Institucional:</h2>
              <p className="flex items-center gap-2 text-white/90">
                <Mail className="h-4 w-4 shrink-0" />
                contacto@gotfreshbreath.mx
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">Atención Corporativa</h2>
              <p className="flex items-center gap-2 text-white/90">
                <Clock className="h-4 w-4 shrink-0" />
                Lunes a Viernes – 8:30 am a 5:30 pm
              </p>
              <p className="mt-2 flex items-start gap-2 text-white/90">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Torreón 514, Chapultepec, 66450
                  <br />
                  San Nicolás de los Garza, N.L.
                </span>
              </p>
            </div>
          </div>

          <Globe className="mx-auto h-40 w-40 text-white/25 md:h-56 md:w-56" strokeWidth={1} />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="mb-3 text-center text-xs font-bold tracking-widest text-slate-500">
          DIRECCIÓN GOOGLE MAPS
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1153.165092566478!2d-100.3004995191647!3d25.74199834960554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866294f46c195555%3A0xa618b547fb6d70b3!2sThunder%20Led%20Lights%20Mexico!5e0!3m2!1ses!2smx!4v1783967419468!5m2!1ses!2smx"
          width="100%"
          height="340"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Got Fresh Breath"
          className="rounded"
        />

        <div className="mx-auto mt-16 max-w-md">
          <h2 className="mb-6 text-center text-xl font-bold text-slate-900">Envíanos tu mensaje</h2>
          <LeadForm tipo="contacto" />
        </div>
      </div>
    </>
  )
}
