import { getPayloadClient } from '@/lib/payload'

export async function ClientesDestacados() {
  const payload = await getPayloadClient()
  const { docs: clients } = await payload.find({
    collection: 'clients',
    where: { activo: { equals: true } },
    sort: 'orden',
    limit: 100,
  })

  if (clients.length === 0) return null

  return (
    <section className="border-t-2 border-brand-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Algunos de nuestros clientes</h2>
        <p className="mb-10 max-w-3xl text-slate-700">
          <span className="font-semibold text-brand-600">Empresas de clase mundial</span> ya disfrutan de la
          experiencia <span className="font-semibold text-brand-600">Got Fresh Breath</span>.
          <br />
          <br />
          Desde corporativos hasta hoteles y restaurantes, nuestros clientes confían en nosotros para{' '}
          <span className="font-semibold text-brand-600">
            ofrecer frescura, innovación y un valor agregado a colaboradores y visitantes
          </span>
          .
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {clients.map((client) => {
            const logo = typeof client.logo === 'object' ? client.logo : null
            return (
              <div key={client.id} className="flex h-12 items-center justify-center">
                {logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.url}
                    alt={logo.alt || client.nombre}
                    className="h-full w-auto max-w-[10rem] object-contain"
                  />
                ) : (
                  <span className="text-lg font-semibold text-slate-700">{client.nombre}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
