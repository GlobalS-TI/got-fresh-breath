import { getSession } from '@/lib/session'
import { NavbarClient } from '@/components/NavbarClient'

export async function Navbar() {
  const user = await getSession()

  return <NavbarClient user={user ? { nombre: user.nombre } : null} />
}
