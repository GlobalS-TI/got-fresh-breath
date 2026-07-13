import { LeadForm } from '@/components/LeadForm'

export const metadata = {
  title: 'Se Distribuidor — Got Fresh Breath',
}

const RESPALDO = [
  'Nosotros blindamos tu operación',
  'Suministro garantizado',
  'Distribución oficial y respaldo de marca',
  'Capacitación en venta consultiva',
  'Manejo de objeciones',
]

export default function DistribuidorPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">
        Conviértete en distribuidor oficial de Got Fresh Breath
      </h1>
      <p className="mb-10 text-center text-slate-600">
        Opera un modelo de servicio llave en mano con alta retención de clientes, contratos mensuales y un
        mercado corporativo e industrial.
      </p>

      <div className="mb-10 flex flex-col gap-3 text-slate-700">
        <p>
          <strong>Ingresos Mensuales Recurrentes:</strong> no cobras una sola vez. Cada cliente activo te
          genera un fee mensual constante por concepto de consumibles (enjuague y vasos) y servicio.
        </p>
        <p>
          <strong>Cero Competencia:</strong> estás entrando a una categoría poco explotada. No compites
          contra commodities; vendes una solución exclusiva que las empresas no sabían que necesitaban.
        </p>
        <p>
          <strong>Bajísimo Churn:</strong> al integrarse directamente en los sanitarios de comedores
          industriales o corporativos, el servicio se convierte en un beneficio permanente para el capital
          humano.
        </p>
      </div>

      <h2 className="mb-4 text-xl font-bold text-slate-900">¿Cómo te respaldamos?</h2>
      <ul className="mb-12 flex flex-col gap-2">
        {RESPALDO.map((item) => (
          <li key={item} className="rounded bg-slate-50 px-4 py-2 text-slate-700">
            ✓ {item}
          </li>
        ))}
      </ul>

      <div className="mx-auto max-w-md rounded-lg border border-slate-200 p-6">
        <h2 className="mb-6 text-xl font-bold text-slate-900">Aplica para obtener la distribución en tu zona</h2>
        <LeadForm tipo="distribuidor" />
      </div>
    </div>
  )
}
