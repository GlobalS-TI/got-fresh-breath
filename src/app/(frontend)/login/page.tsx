import Link from 'next/link'

import { LoginForm } from '@/components/LoginForm'
import { safeRedirectPath } from '@/lib/redirect'

export const metadata = {
  title: 'Iniciar sesión - Got Fresh Breath',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const redirectTo = safeRedirectPath((await searchParams).redirect)
  const registroHref = redirectTo ? `/registro?redirect=${encodeURIComponent(redirectTo)}` : '/registro'

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Iniciar sesión</h1>
      <LoginForm redirectTo={redirectTo} />
      <p className="mt-6 text-sm text-slate-600">
        ¿No tienes cuenta?{' '}
        <Link href={registroHref} className="font-semibold text-brand-600 hover:underline">
          Crea una aquí
        </Link>
      </p>
    </div>
  )
}
