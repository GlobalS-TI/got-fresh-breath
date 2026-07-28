import Link from 'next/link'
import { redirect } from 'next/navigation'

import { logoutAction } from '@/actions/auth'
import { getSession } from '@/lib/session'

export const metadata = {
  title: 'Mi cuenta - Got Fresh Breath',
}

export default async function CuentaPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Hola, {user.nombre}</h1>
      <dl className="mb-8 flex flex-col gap-2 text-sm text-slate-700">
        <div>
          <dt className="inline font-semibold">Email: </dt>
          <dd className="inline">{user.email}</dd>
        </div>
        <div>
          <dt className="inline font-semibold">Rol: </dt>
          <dd className="inline">{user.rol}</dd>
        </div>
        {user.empresa && (
          <div>
            <dt className="inline font-semibold">Empresa: </dt>
            <dd className="inline">{user.empresa}</dd>
          </div>
        )}
      </dl>
      <Link
        href="/cuenta/pedidos"
        className="mb-4 inline-block font-semibold text-brand-600 hover:underline"
      >
        Ver mis pedidos
      </Link>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}
