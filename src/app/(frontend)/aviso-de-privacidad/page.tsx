import type { ReactNode } from 'react'

import { metadatosDePagina } from '@/lib/sitio'

export const metadata = metadatosDePagina({
  titulo: 'Aviso de Privacidad - Got Fresh Breath',
  descripcion:
    'Aviso de Privacidad Integral de Got Fresh Breath México, operado por Global Supplier MTY, S.A. de C.V.',
  ruta: '/aviso-de-privacidad',
})

const CORREO_PRIVACIDAD = 'privacidad@globalsupplier.com.mx'

function CorreoPrivacidad() {
  return (
    <a href={`mailto:${CORREO_PRIVACIDAD}`} className="font-semibold text-brand-600 hover:underline">
      {CORREO_PRIVACIDAD}
    </a>
  )
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-slate-900">{titulo}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

export default function AvisoPrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 leading-relaxed text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900">Aviso de Privacidad Integral</h1>
      <p className="mt-1 italic text-slate-500">Got Fresh Breath México</p>

      <dl className="mt-6 space-y-1 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm">
        <div>
          <dt className="inline font-semibold text-slate-900">Responsable: </dt>
          <dd className="inline">Global Supplier MTY, S.A. de C.V.</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-slate-900">RFC: </dt>
          <dd className="inline">GSM160401AJA</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-slate-900">Domicilio: </dt>
          <dd className="inline">
            Calle Torreón 514, Colonia Chapultepec, C.P. 66450, San Nicolás de los Garza, Nuevo León,
            México.
          </dd>
        </div>
        <div>
          <dt className="inline font-semibold text-slate-900">Correo de privacidad: </dt>
          <dd className="inline">
            <CorreoPrivacidad />
          </dd>
        </div>
        <div>
          <dt className="inline font-semibold text-slate-900">Sitio web: </dt>
          <dd className="inline">https://gotfreshbreath.mx</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-slate-900">Última actualización: </dt>
          <dd className="inline">19 de octubre de 2026.</dd>
        </div>
      </dl>

      <Seccion titulo="1. Responsable del tratamiento">
        <p>
          Global Supplier MTY, S.A. de C.V., empresa que comercializa Got Fresh Breath en México, es
          responsable del tratamiento de los datos personales proporcionados mediante su sitio web,
          formularios de contacto, campañas publicitarias y comunicaciones comerciales.
        </p>
      </Seccion>

      <Seccion titulo="2. Datos personales recopilados">
        <p>
          Podemos solicitar nombre, apellidos, empresa, puesto, correo electrónico, teléfono, tipo de
          establecimiento, ubicación empresarial e información relacionada con solicitudes de
          cotización o contratación.
        </p>
        <p>
          En los formularios de LinkedIn podremos recopilar únicamente los campos que se indiquen al
          momento de enviar la solicitud.
        </p>
        <p>No solicitamos datos personales sensibles para las actividades de prospección comercial.</p>
      </Seccion>

      <Seccion titulo="3. Finalidades del tratamiento">
        <p className="font-semibold text-slate-900">Finalidades primarias:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Atender solicitudes de información y cotización.</li>
          <li>Contactar a personas interesadas en nuestros productos y servicios.</li>
          <li>Elaborar propuestas comerciales.</li>
          <li>Dar seguimiento a oportunidades de negocio.</li>
          <li>Gestionar relaciones comerciales y obligaciones derivadas de contratos.</li>
          <li>Proporcionar atención y soporte relacionados con nuestros productos.</li>
        </ul>
        <p className="font-semibold text-slate-900">Finalidades secundarias:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Enviar promociones, novedades y comunicaciones comerciales.</li>
          <li>Realizar encuestas de satisfacción y análisis comerciales.</li>
          <li>Compartir información sobre otras soluciones ofrecidas por Global Supplier MTY.</li>
        </ul>
        <p>
          Las personas titulares pueden oponerse al tratamiento para finalidades secundarias
          escribiendo a <CorreoPrivacidad />, sin que esto afecte la atención de una solicitud
          comercial.
        </p>
      </Seccion>

      <Seccion titulo="4. Uso y resguardo de información">
        <p>
          Los datos personales podrán ser tratados mediante herramientas tecnológicas utilizadas para
          la administración de contactos, seguimiento comercial, campañas publicitarias y atención a
          clientes.
        </p>
        <p>
          Se aplicarán medidas administrativas, técnicas y organizativas razonables para proteger la
          información contra accesos, usos o divulgaciones no autorizados.
        </p>
        <p>
          Los datos se conservarán durante el tiempo necesario para cumplir las finalidades informadas
          y las obligaciones legales aplicables, y posteriormente serán eliminados o bloqueados cuando
          corresponda.
        </p>
      </Seccion>

      <Seccion titulo="5. Proveedores y transferencias">
        <p>
          Podremos utilizar prestadores de servicios tecnológicos, hospedaje, correo electrónico, CRM
          y publicidad digital que traten datos por nuestra cuenta y conforme a instrucciones
          contractuales y medidas de protección aplicables.
        </p>
        <p>
          Cualquier transferencia de datos a terceros que requiera consentimiento se realizará
          únicamente cuando se cuente con éste o resulte aplicable una excepción legal. En caso de
          requerirse, se informará sobre los destinatarios y finalidades correspondientes.
        </p>
      </Seccion>

      <Seccion titulo="6. Derechos ARCO">
        <p>
          Usted tiene derecho a solicitar el acceso, rectificación, cancelación u oposición respecto
          de sus datos personales, conforme a la legislación aplicable.
        </p>
        <p>
          Para ejercer estos derechos, envíe una solicitud a: <CorreoPrivacidad />
        </p>
        <p>
          Incluya su nombre, un medio para recibir notificaciones, el derecho que desea ejercer, la
          descripción de los datos correspondientes y los elementos necesarios para acreditar su
          identidad o representación.
        </p>
        <p>La solicitud será atendida dentro de los plazos establecidos por la legislación mexicana.</p>
        <p>
          También podrá solicitar la revocación del consentimiento o la limitación del uso de sus
          datos cuando legalmente proceda.
        </p>
      </Seccion>

      <Seccion titulo="7. Cambios al aviso">
        <p>
          Las modificaciones a este Aviso de Privacidad se comunicarán mediante su publicación en:
        </p>
        <p className="font-semibold text-slate-900">https://gotfreshbreath.mx/aviso-de-privacidad</p>
      </Seccion>

      <Seccion titulo="8. Contacto">
        <p>
          Para preguntas relacionadas con este Aviso de Privacidad o con el tratamiento de sus datos
          personales:
        </p>
        <p>
          <strong className="text-slate-900">Global Supplier MTY, S.A. de C.V.</strong>
          <br />
          <CorreoPrivacidad />
        </p>
      </Seccion>
    </article>
  )
}
