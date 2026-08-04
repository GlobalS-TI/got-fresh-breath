export type SiteMediaSlotDef = {
  key: string
  label: string
}

// Fuente única de verdad para los slots de media reemplazables del sitio.
// Alimenta el defaultValue del global `site-media` y el hook que lo reconcilia
// (src/globals/SiteMedia.ts) — agregar un placeholder nuevo en el frontend
// implica agregar su entrada aquí.
export const SITE_MEDIA_SLOTS: SiteMediaSlotDef[] = [
  { key: 'home.hero-trato-cliente', label: 'Home - Video trato al cliente' },
  { key: 'corporate-reputation.recepcion', label: 'Home - Foto personal en recepción' },
  { key: 'nosotros.hero-agua', label: 'Nosotros - Video agua en movimiento' },
  { key: 'programa-integral.instalacion-estetica', label: 'Nosotros - Foto dispensadores en pared' },
  { key: 'programa-integral.mantenimiento', label: 'Nosotros - Foto dispensador en baño' },
  {
    key: 'programa-integral.reposicion-consumibles',
    label: 'Nosotros - Foto enjuague/vasos (si se deja vacío, usa la foto de un producto consumible activo)',
  },
  { key: 'programa-integral.operacion-continua', label: 'Nosotros - Foto logística en almacén' },
  { key: 'programa-section.colaboradores', label: 'Sectores - Foto colaboradores en oficina' },
  { key: 'sectores.hoteles', label: 'Sector - Hoteles & Resorts' },
  { key: 'sectores.restaurantes', label: 'Sector - Restaurantes' },
  { key: 'sectores.corporativos', label: 'Sector - Empresarial y Corporativos' },
  { key: 'sectores.salud', label: 'Sector - Salud' },
  { key: 'sectores.comercial', label: 'Sector - Comercial' },
  { key: 'sectores.hogar', label: 'Sector - Hogar' },
  { key: 'contacto.hero-agua', label: 'Contacto - Video agua fluyendo' },
  { key: 'sectores-page.hero-agua', label: 'Sectores - Video agua en movimiento' },
  { key: 'tienda.hero-animacion', label: 'Tienda - Animación 3D dispensador' },
  { key: 'instalacion.hero-video', label: 'Instalación - Video de instalación' },
]
