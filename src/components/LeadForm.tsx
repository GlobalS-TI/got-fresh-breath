'use client'

import { useActionState, useState } from 'react'

import { submitLeadAction, type LeadActionState } from '@/actions/leads'
import type { Lead } from '@/payload-types'

const initialState: LeadActionState = { error: '', success: false }

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none'
const labelClass = 'flex flex-col gap-1 text-sm font-medium text-slate-700'
const checkboxRowClass = 'flex items-center gap-2 text-sm font-normal text-slate-700'
const checkboxInputClass = 'h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500'

const SECTOR_OPTIONS: { label: string; value: string }[] = [
  { label: 'Hoteles & Resorts', value: 'hoteles' },
  { label: 'Restaurantes', value: 'restaurantes' },
  { label: 'Empresarial y Corporativos', value: 'corporativos' },
  { label: 'Salud', value: 'salud' },
  { label: 'Comercial', value: 'comercial' },
  { label: 'Hogar', value: 'hogar' },
]

const COLABORADORES_OPTIONS = [
  { value: 'menos_100', label: 'Menos de 100' },
  { value: '100_500', label: '100 a 500' },
  { value: 'mas_500', label: 'Más de 500' },
]

const INTERACCION_OPTIONS = [
  { value: 'alta', label: 'Sí, interacción constante' },
  { value: 'moderada', label: 'Interacción moderada' },
  { value: 'baja', label: 'No, solo busco implementar en los baños' },
]

type LeadFormProps = {
  tipo: Lead['tipo']
  sectoresSeleccionados?: string[]
}

export function LeadForm({ tipo, sectoresSeleccionados }: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(submitLeadAction, initialState)
  const [colaboradores, setColaboradores] = useState('')
  const [interaccion, setInteraccion] = useState('')

  if (state.success) {
    return (
      <p className="rounded-md bg-brand-50 px-4 py-3 text-brand-700">
        ¡Gracias! Recibimos tu solicitud y te contactaremos pronto.
      </p>
    )
  }

  const contactFields = (
    <>
      <label className={labelClass}>
        Nombre y apellido
        <input type="text" name="nombre" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Correo electrónico
        <input type="email" name="email" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Teléfono
        <input type="tel" name="telefono" className={inputClass} />
      </label>
    </>
  )

  if (tipo === 'sectores') {
    return (
      <form action={formAction} className="flex flex-col gap-6">
        <input type="hidden" name="tipo" value={tipo} />
        {sectoresSeleccionados?.map((sector) => (
          <input key={sector} type="hidden" name="sector" value={sector} />
        ))}

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                ¿Para cuántos colaboradores calculas la cobertura?
              </p>
              <div className="flex flex-col gap-2">
                {COLABORADORES_OPTIONS.map((opt) => (
                  <label key={opt.value} className={checkboxRowClass}>
                    <input
                      type="checkbox"
                      checked={colaboradores === opt.value}
                      onChange={() => setColaboradores(opt.value)}
                      className={checkboxInputClass}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <input type="hidden" name="colaboradores" value={colaboradores} />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                ¿Tu ubicación cuenta con comedor interno o alto flujo de interacciones?
              </p>
              <div className="flex flex-col gap-2">
                {INTERACCION_OPTIONS.map((opt) => (
                  <label key={opt.value} className={checkboxRowClass}>
                    <input
                      type="checkbox"
                      checked={interaccion === opt.value}
                      onChange={() => setInteraccion(opt.value)}
                      className={checkboxInputClass}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <input type="hidden" name="interaccion" value={interaccion} />
            </div>
          </div>

          <div className="flex flex-col gap-4">{contactFields}</div>
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-brand-600 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isPending ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tipo" value={tipo} />

      {contactFields}

      {tipo === 'comodato' && (
        <label className={labelClass}>
          Sector
          <select name="sector" className={inputClass}>
            <option value="">Selecciona un sector</option>
            {SECTOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {tipo === 'distribuidor' && (
        <>
          <label className={labelClass}>
            ¿Tienes experiencia previa en ventas B2B, atención a corporativos o suministros?
            <select name="experienciaB2B" className={inputClass}>
              <option value="sector">Sí, cuento con cartera y experiencia en el sector</option>
              <option value="otros_sectores">Tengo experiencia comercial, pero en otros sectores</option>
              <option value="diversificar">Estoy buscando diversificar mis inversiones</option>
            </select>
          </label>
          <label className={labelClass}>
            ¿Cuál es tu capacidad de penetración inmediata en el mercado local?
            <select name="penetracionMercado" className={inputClass}>
              <option value="alta">Alta (contacto directo con plantas, corporativos o cadenas)</option>
              <option value="moderada">Moderada (equipo de ventas listo)</option>
            </select>
          </label>
        </>
      )}

      {tipo === 'contacto' && (
        <label className={labelClass}>
          Mensaje
          <textarea name="notas" rows={4} className={inputClass} />
        </label>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-600 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isPending ? 'Enviando...' : 'Enviar Solicitud'}
      </button>
    </form>
  )
}
