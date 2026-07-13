import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="bg-brand-700 text-brand-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-white">
          <Logo />
          <span className="text-brand-200">·</span>
          <span className="text-sm font-medium text-brand-100">GLOBALsupplier</span>
        </div>

        <div className="flex flex-col gap-1 text-sm text-brand-100 md:items-end">
          <span>(81) 1680 9833</span>
          <span>ventas@gotfreshbreath.mx</span>
        </div>
      </div>

      <div className="border-t border-brand-600/50 px-6 py-4 text-center text-xs text-brand-200">
        <div className="flex justify-center gap-4">
          <span>Facebook</span>
          <span>Instagram</span>
        </div>
      </div>
    </footer>
  )
}
