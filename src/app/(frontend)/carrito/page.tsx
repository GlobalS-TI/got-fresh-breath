import Link from 'next/link'

export const metadata = {
  title: 'Carrito — Got Fresh Breath',
}

export default function CarritoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="mb-4 text-3xl font-bold text-slate-900">Tu carrito</h1>
      <p className="text-slate-600">
        El carrito y el checkout en línea están en construcción. Mientras tanto, visita la{' '}
        <Link href="/tienda" className="font-semibold text-brand-600 hover:underline">
          tienda
        </Link>{' '}
        o contáctanos para cotizar tu pedido.
      </p>
    </div>
  )
}
