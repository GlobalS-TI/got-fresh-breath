import Link from 'next/link'
import { redirect } from 'next/navigation'

import { logoutAction } from '@/actions/auth'
import { PerfilForm } from '@/components/PerfilForm'
import { getSession } from '@/lib/session'

export const metadata = {
  title: 'Mi cuenta - Got Fresh Breath',
  robots: { index: false },
}

export default async function CuentaPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login')
  }

  const requiereEmpresa = user.rol === 'empresa' || user.rol === 'distribuidor'

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

      <section className="mb-8">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Tus datos</h2>
        {!user.telefono && (
          <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            Agrega tu teléfono para poder hacer pedidos.
          </p>
        )}
        <PerfilForm
          telefono={user.telefono ?? ''}
          empresa={user.empresa ?? ''}
          requiereEmpresa={requiereEmpresa}
          datosFiscales={user.datosFiscales ?? null}
        />
      </section>

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
