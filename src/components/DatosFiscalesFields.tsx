import { type DatosFiscales, REGIMENES_FISCALES, USOS_CFDI } from '@/lib/datos-fiscales'

const inputClass =
  'rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none'
const labelClass = 'flex flex-col gap-1 text-sm font-medium text-slate-700'

type DatosFiscalesFieldsProps = {
  defaults?: DatosFiscales | null
}

// Campos de datos fiscales compartidos entre el registro y la edición de perfil en /cuenta.
// Son opcionales — van dentro de un <details> para no alargar el formulario a quien no factura.
export function DatosFiscalesFields({ defaults }: DatosFiscalesFieldsProps) {
  return (
    <details open={Boolean(defaults?.rfc)} className="rounded-md border border-slate-200 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-slate-900">
        Datos fiscales (opcional, solo si requieres factura)
      </summary>
      <div className="mt-4 flex flex-col gap-4">
        <label className={labelClass}>
          RFC
          <input
            type="text"
            name="rfc"
            defaultValue={defaults?.rfc ?? ''}
            maxLength={13}
            className={`${inputClass} uppercase`}
          />
        </label>
        <label className={labelClass}>
          Razón social
          <input
            type="text"
            name="razonSocial"
            defaultValue={defaults?.razonSocial ?? ''}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Régimen fiscal
          <select name="regimenFiscal" defaultValue={defaults?.regimenFiscal ?? ''} className={inputClass}>
            <option value="">Selecciona…</option>
            {REGIMENES_FISCALES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Uso de CFDI
          <select name="usoCfdi" defaultValue={defaults?.usoCfdi ?? ''} className={inputClass}>
            <option value="">Selecciona…</option>
            {USOS_CFDI.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Código postal fiscal
          <input
            type="text"
            name="cpFiscal"
            inputMode="numeric"
            maxLength={5}
            defaultValue={defaults?.cpFiscal ?? ''}
            className={inputClass}
          />
        </label>
      </div>
    </details>
  )
}
