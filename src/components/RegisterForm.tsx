'use client'

import { useActionState, useState } from 'react'

import { registerAction, type AuthActionState } from '@/actions/auth'

const initialState: AuthActionState = { error: '' }

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none'
const labelClass = 'flex flex-col gap-1 text-sm font-medium text-slate-700'

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)
  const [rol, setRol] = useState<'individual' | 'empresa'>('individual')

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex gap-4 text-sm font-medium text-slate-700">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="rol"
            value="individual"
            checked={rol === 'individual'}
            onChange={() => setRol('individual')}
          />
          Individual
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="rol"
            value="empresa"
            checked={rol === 'empresa'}
            onChange={() => setRol('empresa')}
          />
          Empresa
        </label>
      </div>

      <label className={labelClass}>
        Nombre
        <input type="text" name="nombre" required autoComplete="given-name" className={inputClass} />
      </label>
      <label className={labelClass}>
        Apellido
        <input type="text" name="apellido" required autoComplete="family-name" className={inputClass} />
      </label>
      {rol === 'empresa' && (
        <label className={labelClass}>
          Nombre de empresa
          <input type="text" name="empresa" required autoComplete="organization" className={inputClass} />
        </label>
      )}
      <label className={labelClass}>
        Email
        <input type="email" name="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className={labelClass}>
        Contraseña
        <input type="password" name="password" required autoComplete="new-password" className={inputClass} />
      </label>
      <label className={labelClass}>
        Confirmar contraseña
        <input
          type="password"
          name="confirmPassword"
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-600 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  )
}
