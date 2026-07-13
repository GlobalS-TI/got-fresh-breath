import { CarritoClient } from '@/components/CarritoClient'
import { getSession } from '@/lib/session'

export const metadata = {
  title: 'Carrito — Got Fresh Breath',
}

export default async function CarritoPage() {
  const user = await getSession()

  return (
    <CarritoClient
      user={user ? { nombre: user.nombre, email: user.email, rol: user.rol } : null}
    />
  )
}
