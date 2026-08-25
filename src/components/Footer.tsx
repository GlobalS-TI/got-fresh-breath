import type { SVGProps } from 'react'

import { Mail, MessageCircle } from 'lucide-react'

import { Logo } from '@/components/Logo'
import { LogoGlobal } from '@/components/GlobalLogo'

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1={17.5} y1={6.5} x2={17.5} y2={6.5} />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-white text-brand-700">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-white">
          <Logo />
          <span className="text-brand-500">-</span>
          <LogoGlobal />
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-brand-600 md:items-end">
          <a
            href="https://wa.me/528116809833"
            className="flex items-center gap-2 hover:text-white md:flex-row-reverse"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            (81) 1680 9833
          </a>
          <a
            href="mailto:ventas@gotfreshbreath.mx"
            className="flex items-center gap-2 hover:text-white md:flex-row-reverse"
          >
            <Mail className="h-4 w-4 shrink-0" />
            ventas@gotfreshbreath.mx
          </a>
        </div>
      </div>

      <div className="border-t border-brand-600/50 px-6 py-4">
        <div className="flex justify-center gap-4">
          <a href="#" aria-label="Facebook" className="text-brand-600 hover:text-white">
            <FacebookIcon className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Instagram" className="text-brand-600 hover:text-white">
            <InstagramIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
