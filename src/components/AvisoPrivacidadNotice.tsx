import Link from 'next/link'

// Leyenda junto al botón de envío de cualquier formulario que recabe datos
// personales — el aviso debe estar a la mano en el momento de recabarlos.
export function AvisoPrivacidadNotice() {
  return (
    <p className="text-xs text-slate-500">
      Al enviar tus datos aceptas nuestro{' '}
      <Link href="/aviso-de-privacidad" target="_blank" className="underline hover:text-brand-600">
        Aviso de Privacidad
      </Link>
      .
    </p>
  )
}
