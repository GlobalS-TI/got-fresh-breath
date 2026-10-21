// Productos que vende la landing /consultorios. Se crean en la migración
// 20261021_*_productos_consultorios (que tiene su propia copia de los datos, como toda migración);
// aquí solo viven los slugs con los que la landing los busca.

export type PaqueteConsultorio = 'kit' | 'paquete3' | 'caja6'
export type ColorDispensador = 'blanco' | 'negro' | 'niquel'

export const SLUGS_KIT: Record<ColorDispensador, string> = {
  blanco: 'kit-inicio-blanco',
  negro: 'kit-inicio-negro',
  niquel: 'kit-inicio-niquel',
}

export const SLUG_PAQUETE_3 = 'paquete-3-botellas'
export const SLUG_CAJA_6 = 'caja-6-botellas'

export const SLUGS_CONSULTORIOS = [...Object.values(SLUGS_KIT), SLUG_PAQUETE_3, SLUG_CAJA_6]

export function slugDePaquete(paquete: PaqueteConsultorio, color: ColorDispensador): string {
  if (paquete === 'kit') return SLUGS_KIT[color]
  return paquete === 'paquete3' ? SLUG_PAQUETE_3 : SLUG_CAJA_6
}

export function esPaquete(valor: unknown): valor is PaqueteConsultorio {
  return valor === 'kit' || valor === 'paquete3' || valor === 'caja6'
}

export function esColor(valor: unknown): valor is ColorDispensador {
  return valor === 'blanco' || valor === 'negro' || valor === 'niquel'
}
