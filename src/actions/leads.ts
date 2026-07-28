'use server'

import { getPayloadClient } from '@/lib/payload'
import { checkRateLimit } from '@/lib/rate-limit'
import type { Lead } from '@/payload-types'

export type LeadActionState = { error: string; success: boolean }

const VALID_TIPOS: Lead['tipo'][] = ['sectores', 'distribuidor', 'contacto', 'comodato']

function optionalString(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) || '').trim()
  return value || undefined
}

function multiValue(formData: FormData, key: string): string[] | undefined {
  const values = formData.getAll(key).map(String).filter(Boolean)
  return values.length > 0 ? values : undefined
}

export async function submitLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const rateLimit = await checkRateLimit('leads', 5, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error, success: false }
  }

  const nombre = String(formData.get('nombre') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const tipo = String(formData.get('tipo') || '') as Lead['tipo']

  if (!nombre || !email || !VALID_TIPOS.includes(tipo)) {
    return { error: 'Faltan datos requeridos.', success: false }
  }

  const payload = await getPayloadClient()

  try {
    await payload.create({
      collection: 'leads',
      data: {
        nombre,
        email,
        telefono: optionalString(formData, 'telefono'),
        tipo,
        sector: multiValue(formData, 'sector') as Lead['sector'],
        colaboradores: optionalString(formData, 'colaboradores') as Lead['colaboradores'],
        interaccion: optionalString(formData, 'interaccion') as Lead['interaccion'],
        experienciaB2B: optionalString(formData, 'experienciaB2B') as Lead['experienciaB2B'],
        penetracionMercado: optionalString(formData, 'penetracionMercado') as Lead['penetracionMercado'],
        notas: optionalString(formData, 'notas'),
      },
    })
  } catch {
    return { error: 'No se pudo enviar tu solicitud. Intenta de nuevo.', success: false }
  }

  return { error: '', success: true }
}
