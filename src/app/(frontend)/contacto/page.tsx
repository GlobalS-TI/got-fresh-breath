import { LeadForm } from '@/components/LeadForm'

export const metadata = {
  title: 'Contacto — Got Fresh Breath',
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 text-3xl font-bold text-slate-900">Contacto</h1>

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-brand-700">Línea Directa Corporativa</h2>
          <p className="mb-6 text-slate-700">(81) 1680 9833</p>

          <h2 className="mb-2 text-lg font-semibold text-brand-700">Consultoría Institucional</h2>
          <p className="mb-6 text-slate-700">contacto@gotfreshbreath.mx</p>

          <h2 className="mb-2 text-lg font-semibold text-brand-700">Atención Corporativa</h2>
          <p className="text-slate-700">Lunes a Viernes – 8:30 am a 5:30 pm</p>
          <p className="mb-6 text-slate-700">Torreón 514, Chapultepec, 66450, San Nicolás de los Garza, N.L.</p>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1153.165092566478!2d-100.3004995191647!3d25.74199834960554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866294f46c195555%3A0xa618b547fb6d70b3!2sThunder%20Led%20Lights%20Mexico!5e0!3m2!1ses!2smx!4v1783967419468!5m2!1ses!2smx"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Got Fresh Breath"
            className="rounded"
          />
        </div>

        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-900">Envíanos tu mensaje</h2>
          <LeadForm tipo="contacto" />
        </div>
      </div>
    </div>
  )
}
