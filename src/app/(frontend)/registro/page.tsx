import Link from 'next/link'

import { RegisterForm } from '@/components/RegisterForm'

export const metadata = {
  title: 'Crear cuenta - Got Fresh Breath',
}

export default function RegistroPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Crear cuenta</h1>
      <RegisterForm />
      <p className="mt-6 text-sm text-slate-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
