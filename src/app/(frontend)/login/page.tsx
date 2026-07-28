import Link from 'next/link'

import { LoginForm } from '@/components/LoginForm'

export const metadata = {
  title: 'Iniciar sesión - Got Fresh Breath',
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Iniciar sesión</h1>
      <LoginForm />
      <p className="mt-6 text-sm text-slate-600">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="font-semibold text-brand-600 hover:underline">
          Crea una aquí
        </Link>
      </p>
    </div>
  )
}
