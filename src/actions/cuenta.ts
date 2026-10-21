'use server'

import { revalidatePath } from 'next/cache'

import { isTelefonoValido, parseDatosFiscales } from '@/lib/datos-fiscales'
import { getPayloadClient } from '@/lib/payload'
import { checkRateLimit } from '@/lib/rate-limit'
import { getSession } from '@/lib/session'

export type PerfilActionState = { error: string; success: boolean }

export async function updatePerfilAction(
  _prevState: PerfilActionState,
  formData: FormData,
): Promise<PerfilActionState> {
  const rateLimit = await checkRateLimit('perfil', 10, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error, success: false }
  }

  const user = await getSession()
  if (!user) {
    return { error: 'Tu sesión expiró. Inicia sesión de nuevo.', success: false }
  }

  const telefono = String(formData.get('telefono') || '').trim()
  const empresa = String(formData.get('empresa') || '').trim()

  if (!telefono) {
    return { error: 'El teléfono es requerido.', success: false }
  }
  if (!isTelefonoValido(telefono)) {
    return { error: 'El teléfono debe tener 10 dígitos.', success: false }
  }
  const requiereEmpresa = user.rol === 'empresa' || user.rol === 'distribuidor'
  if (requiereEmpresa && !empresa) {
    return { error: 'El nombre de la empresa es requerido.', success: false }
  }

  const fiscales = parseDatosFiscales(formData)
  if (!fiscales.ok) {
    return { error: fiscales.error, success: false }
  }

  const payload = await getPayloadClient()

  try {
    // overrideAccess: false + user — se aplica el access control de Users (solo su propio doc)
    // y el hook enforceDefaultRol, igual que si editara desde la API.
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        telefono,
        ...(requiereEmpresa ? { empresa } : {}),
        // Vaciar los campos en el formulario borra los datos fiscales guardados.
        datosFiscales: fiscales.datosFiscales ?? {
          rfc: null,
          razonSocial: null,
          regimenFiscal: null,
          usoCfdi: null,
          cpFiscal: null,
        },
      },
      overrideAccess: false,
      user,
    })
  } catch {
    return { error: 'No se pudieron guardar tus datos. Intenta de nuevo.', success: false }
  }

  revalidatePath('/cuenta')
  return { error: '', success: true }
}
