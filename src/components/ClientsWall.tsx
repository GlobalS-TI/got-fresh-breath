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
    <section className="bg-slate-band py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">Nuestros Clientes</h2>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {clients.map((client) => {
            const logo = typeof client.logo === 'object' ? client.logo : null
            return (
              <span key={client.id} className="text-lg font-semibold text-white/90">
                {logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo.url} alt={logo.alt || client.nombre} className="h-10 w-auto object-contain" />
                ) : (
                  client.nombre
                )}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
