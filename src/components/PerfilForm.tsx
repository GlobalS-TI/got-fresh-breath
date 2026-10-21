'use client'

import { useActionState } from 'react'

import { updatePerfilAction, type PerfilActionState } from '@/actions/cuenta'
import { DatosFiscalesFields } from '@/components/DatosFiscalesFields'
import type { DatosFiscales } from '@/lib/datos-fiscales'

const initialState: PerfilActionState = { error: '', success: false }

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none'
const labelClass = 'flex flex-col gap-1 text-sm font-medium text-slate-700'

type PerfilFormProps = {
  telefono: string
  empresa: string
  requiereEmpresa: boolean
  datosFiscales: DatosFiscales | null
}

export function PerfilForm({ telefono, empresa, requiereEmpresa, datosFiscales }: PerfilFormProps) {
  const [state, formAction, isPending] = useActionState(updatePerfilAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className={labelClass}>
        Teléfono
        <input
          type="tel"
          name="telefono"
          required
          autoComplete="tel"
          defaultValue={telefono}
          placeholder="81 1234 5678"
          className={inputClass}
        />
      </label>
      {requiereEmpresa && (
        <label className={labelClass}>
          Nombre de empresa
          <input
            type="text"
            name="empresa"
            required
            autoComplete="organization"
            defaultValue={empresa}
            className={inputClass}
          />
        </label>
      )}
      <DatosFiscalesFields defaults={datosFiscales} />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-700">Tus datos se guardaron.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-600 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isPending ? 'Guardando...' : 'Guardar datos'}
      </button>
    </form>
  )
}
