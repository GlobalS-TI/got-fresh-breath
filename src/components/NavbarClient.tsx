'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { User, ShoppingCart } from 'lucide-react'

import { logoutAction } from '@/actions/auth'
import { Logo } from '@/components/Logo'
import { useCart } from '@/lib/cart-context'

const NAV_LINKS = [
  { href: '/tienda', label: 'Tienda' },
  { href: '/sectores', label: 'Sectores' },
  { href: '/instalacion', label: 'Instalación' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

type NavbarClientProps = {
  user: { nombre: string } | null
}

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(!isHome)
  const { count } = useCart()

  // Solo la home tiene un hero con fondo propio detrás del nav — el resto de páginas
  // siempre lo muestra sólido para no quedar flotando sobre contenido blanco.
  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const solid = scrolled || menuOpen
  const textColor = solid ? 'text-slate-600' : 'text-white/90'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-slate-200 bg-white' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Logo light={!solid} />
        </Link>

        <nav className={`hidden items-center gap-6 text-sm font-medium md:flex ${textColor}`}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={`hidden items-center gap-4 md:flex ${textColor}`}>
          <Link href="/carrito" aria-label="Carrito" className="relative hover:text-brand-600">
            <ShoppingCart />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="text-sm font-medium hover:text-brand-600"
              >
                Hola, {user.nombre} ▾
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white py-1 text-slate-700 shadow-lg">
                  <Link
                    href="/cuenta"
                    className="block px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setAccountOpen(false)}
                  >
                    Mi cuenta
                  </Link>
                  <Link
                    href="/cuenta/pedidos"
                    className="block px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => setAccountOpen(false)}
                  >
                    Mis pedidos
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                    >
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" aria-label="Iniciar sesión" className="hover:text-brand-600">
              <User />
            </Link>
          )}

          <Link
            href="/distribuidor"
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
              solid
                ? 'border-brand-300 text-brand-700 hover:bg-brand-50'
                : 'border-white/70 text-white hover:bg-white/10'
            }`}
          >
            Se Distribuidor
          </Link>
        </div>

        <button
          type="button"
          className={textColor}
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="md:hidden">☰</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 text-slate-600 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/carrito" onClick={() => setMenuOpen(false)}>
              Carrito
            </Link>
            {user ? (
              <>
                <Link href="/cuenta" onClick={() => setMenuOpen(false)}>
                  Mi cuenta
                </Link>
                <Link href="/cuenta/pedidos" onClick={() => setMenuOpen(false)}>
                  Mis pedidos
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="text-left">
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Iniciar sesión
              </Link>
            )}
            <Link
              href="/distribuidor"
              className="rounded-md bg-brand-600 px-4 py-2 text-center font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Se Distribuidor
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
