import { getPayloadClient } from '@/lib/payload'

export async function ClientsWall() {
  const payload = await getPayloadClient()
  const { docs: clients } = await payload.find({
    collection: 'clients',
    where: { activo: { equals: true } },
    sort: 'orden',
    limit: 100,
  })

  if (clients.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-brand-900">Nuestros Clientes</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-6">
          {clients.map((client) => {
            const logo = typeof client.logo === 'object' ? client.logo : null
            return (
              <div key={client.id} className="flex h-30 w-full items-center justify-center">
                {logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.url}
                    alt={logo.alt || client.nombre}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-semibold text-white/90">{client.nombre}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
