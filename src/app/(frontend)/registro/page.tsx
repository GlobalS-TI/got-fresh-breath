import Link from 'next/link'

import { RegisterForm } from '@/components/RegisterForm'
import { safeRedirectPath } from '@/lib/redirect'

export const metadata = {
  title: 'Crear cuenta - Got Fresh Breath',
}

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const redirectTo = safeRedirectPath((await searchParams).redirect)
  const loginHref = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Crear cuenta</h1>
      <RegisterForm redirectTo={redirectTo} />
      <p className="mt-6 text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link href={loginHref} className="font-semibold text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
