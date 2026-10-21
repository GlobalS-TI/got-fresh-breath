import { CarritoClient } from '@/components/CarritoClient'
import { toCheckoutUser } from '@/lib/checkout-user'
import { getSession } from '@/lib/session'

export const metadata = {
  title: 'Carrito - Got Fresh Breath',
}

export default async function CarritoPage() {
  const user = await getSession()

  return <CarritoClient user={toCheckoutUser(user)} />
}
