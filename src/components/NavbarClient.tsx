'use client'

import Link from 'next/link'
import { useState } from 'react'

import { logoutAction } from '@/actions/auth'
import { Logo } from '@/components/Logo'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/carrito" aria-label="Carrito" className="text-slate-600 hover:text-brand-600">
            🛒
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="text-sm font-medium text-slate-700 hover:text-brand-600"
              >
                Hola, {user.nombre} ▾
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  <Link
                    href="/cuenta"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setAccountOpen(false)}
                  >
                    Mi cuenta
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600">
              Iniciar sesión
            </Link>
          )}

          <Link
            href="/distribuidor"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Se Distribuidor
          </Link>
        </div>

        <button
          type="button"
          className="text-slate-700 md:hidden"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-600">
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
