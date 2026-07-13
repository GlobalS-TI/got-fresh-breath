'use client'

import { useActionState } from 'react'

import { loginAction, type AuthActionState } from '@/actions/auth'

const initialState: AuthActionState = { error: '' }

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Contraseña
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none"
        />
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-600 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isPending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
