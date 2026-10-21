// Catálogos del SAT y validación de datos fiscales del cliente. Vive fuera de
// src/collections/Users.ts para poder importarse desde formularios de cliente sin arrastrar
// dependencias de Payload al bundle del navegador.

// c_RegimenFiscal (CFDI 4.0)
export const REGIMENES_FISCALES = [
  { value: '601', label: '601 - General de Ley Personas Morales' },
  { value: '603', label: '603 - Personas Morales con Fines no Lucrativos' },
  { value: '605', label: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { value: '606', label: '606 - Arrendamiento' },
  { value: '608', label: '608 - Demás ingresos' },
  { value: '612', label: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
  { value: '616', label: '616 - Sin obligaciones fiscales' },
  { value: '621', label: '621 - Incorporación Fiscal' },
  { value: '625', label: '625 - Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
  { value: '626', label: '626 - Régimen Simplificado de Confianza' },
]

// c_UsoCFDI — solo los usos que aplican a la compra de dispensadores/consumibles.
export const USOS_CFDI = [
  { value: 'G01', label: 'G01 - Adquisición de mercancías' },
  { value: 'G03', label: 'G03 - Gastos en general' },
  { value: 'S01', label: 'S01 - Sin efectos fiscales' },
]

import type { User } from '@/payload-types'

// RFC de persona moral (3 letras) o física (4 letras) + fecha AAMMDD + homoclave de 3.
const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/
const CP_REGEX = /^\d{5}$/

export type DatosFiscales = NonNullable<User['datosFiscales']>

export type ParseDatosFiscalesResult =
  | { ok: true; datosFiscales: DatosFiscales | null }
  | { ok: false; error: string }

// Los datos fiscales son opcionales: si el cliente no llena ninguno se devuelve `null`; si llena
// alguno, se exigen todos, porque un CFDI 4.0 no se puede timbrar con datos a medias.
export function parseDatosFiscales(formData: FormData): ParseDatosFiscalesResult {
  const campo = (key: string) => String(formData.get(key) || '').trim()

  const datos = {
    rfc: campo('rfc').toUpperCase(),
    razonSocial: campo('razonSocial'),
    regimenFiscal: campo('regimenFiscal'),
    usoCfdi: campo('usoCfdi'),
    cpFiscal: campo('cpFiscal'),
  }

  if (Object.values(datos).every((v) => !v)) {
    return { ok: true, datosFiscales: null }
  }

  if (Object.values(datos).some((v) => !v)) {
    return {
      ok: false,
      error: 'Para facturar completa RFC, razón social, régimen fiscal, uso de CFDI y código postal fiscal.',
    }
  }
  if (!RFC_REGEX.test(datos.rfc)) {
    return { ok: false, error: 'El RFC no tiene un formato válido.' }
  }
  if (!CP_REGEX.test(datos.cpFiscal)) {
    return { ok: false, error: 'El código postal fiscal debe tener 5 dígitos.' }
  }
  if (!REGIMENES_FISCALES.some((r) => r.value === datos.regimenFiscal)) {
    return { ok: false, error: 'Selecciona un régimen fiscal válido.' }
  }
  if (!USOS_CFDI.some((u) => u.value === datos.usoCfdi)) {
    return { ok: false, error: 'Selecciona un uso de CFDI válido.' }
  }

  // Los catálogos ya se validaron arriba, así que el cast a los tipos de select es seguro.
  return { ok: true, datosFiscales: datos as DatosFiscales }
}

// Teléfono mexicano: 10 dígitos, opcionalmente con lada de país (52). Se guarda tal cual lo
// escribió el cliente; solo se valida que tenga la cantidad correcta de dígitos.
export function isTelefonoValido(telefono: string): boolean {
  const digitos = telefono.replace(/\D/g, '')
  return digitos.length === 10 || (digitos.length === 12 && digitos.startsWith('52'))
}
