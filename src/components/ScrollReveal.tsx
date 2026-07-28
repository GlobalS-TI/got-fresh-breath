'use client'

import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'

const PANELS = [
  {
    text: 'El trato al cliente',
    bg: 'bg-gradient-to-b from-brand-300 to-brand-500',
    textClass: 'text-sm font-bold uppercase tracking-widest text-white/80',
  },
  {
    text: 'No solo se entrena',
    bg: 'bg-gradient-to-b from-brand-400 to-brand-600',
    textClass: 'text-2xl font-bold uppercase tracking-wide text-white md:text-3xl',
  },
  {
    text: 'Se equipa',
    bg: 'bg-gradient-to-b from-brand-500 to-brand-700',
    textClass: 'text-4xl font-extrabold uppercase tracking-wide text-white md:text-6xl',
  },
]

export function ScrollReveal() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Sin motion: los paneles quedan apilados en flujo normal (ver clases base en el JSX),
      // sin pin ni overlap — es una degradación aceptable, no una animación reducida.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.reveal-panel')
        const covers = panels.slice(1)

        // Solo con motion habilitado el contenedor se fija a 100vh y los paneles se
        // sacan del flujo para apilarse unos sobre otros — sin esto (fallback de
        // reduced-motion) cada panel ocupa su h-screen normal en el flujo del documento.
        gsap.set(scope.current, { height: '100vh', overflow: 'hidden' })
        gsap.set(panels, { position: 'absolute', inset: 0 })
        gsap.set(covers, { yPercent: 100 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: () => `+=${covers.length * window.innerHeight}`,
            pin: true,
            scrub: 1,
          },
        })

        covers.forEach((panel, i) => {
          tl.to(panel, { yPercent: 0, ease: 'none' }, i)
        })

        return () => tl.scrollTrigger?.kill()
      })

      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section ref={scope} className="relative">
      {PANELS.map((panel) => (
        <div
          key={panel.text}
          className={`reveal-panel relative flex h-screen items-center justify-center ${panel.bg}`}
        >
          <h2 className={panel.textClass}>{panel.text}</h2>
        </div>
      ))}
    </section>
  )
}
