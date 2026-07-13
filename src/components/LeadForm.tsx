'use client'

import { useActionState } from 'react'

import { submitLeadAction, type LeadActionState } from '@/actions/leads'
import type { Lead } from '@/payload-types'

const initialState: LeadActionState = { error: '', success: false }

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none'
const labelClass = 'flex flex-col gap-1 text-sm font-medium text-slate-700'

const SECTOR_OPTIONS: { label: string; value: string }[] = [
  { label: 'Hoteles & Resorts', value: 'hoteles' },
  { label: 'Restaurantes', value: 'restaurantes' },
  { label: 'Empresarial y Corporativos', value: 'corporativos' },
  { label: 'Salud', value: 'salud' },
  { label: 'Comercial', value: 'comercial' },
  { label: 'Hogar', value: 'hogar' },
]

type LeadFormProps = {
  tipo: Lead['tipo']
  sectorPreseleccionado?: string
}

export function LeadForm({ tipo, sectorPreseleccionado }: LeadFormProps) {
  const [state, formAction, isPending] = useActionState(submitLeadAction, initialState)

  if (state.success) {
    return (
      <p className="rounded-md bg-brand-50 px-4 py-3 text-brand-700">
        ¡Gracias! Recibimos tu solicitud y te contactaremos pronto.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tipo" value={tipo} />

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

      {(tipo === 'sectores' || tipo === 'comodato') && (
        <label className={labelClass}>
          Sector
          <select name="sector" defaultValue={sectorPreseleccionado} className={inputClass}>
            <option value="">Selecciona un sector</option>
            {SECTOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {tipo === 'sectores' && (
        <>
          <label className={labelClass}>
            ¿Para cuántos colaboradores calculas la cobertura?
            <select name="colaboradores" className={inputClass}>
              <option value="menos_100">Menos de 100</option>
              <option value="100_500">100 a 500</option>
              <option value="mas_500">Más de 500</option>
            </select>
          </label>
          <label className={labelClass}>
            ¿Tu ubicación cuenta con comedor interno o alto flujo de interacciones?
            <select name="interaccion" className={inputClass}>
              <option value="alta">Sí, interacción constante</option>
              <option value="moderada">Interacción moderada</option>
              <option value="baja">No, solo baños</option>
            </select>
          </label>
        </>
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
