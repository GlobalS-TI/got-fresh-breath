import type { GlobalBeforeChangeHook, GlobalConfig } from 'payload'

import { SITE_MEDIA_SLOTS } from '../lib/siteMediaSlots'

// Evita que el admin borre, duplique o le cambie la key a una fila del
// registro de media — siempre se reconstruye contra la lista canónica,
// conservando únicamente el archivo (`media`) que ya tenía cada slot.
const reconcileSlots: GlobalBeforeChangeHook = ({ data }) => {
  const submitted: Array<{ key?: string; media?: unknown }> = Array.isArray(data?.slots) ? data.slots : []
  const mediaByKey = new Map(submitted.map((slot) => [slot?.key, slot?.media]))

  data.slots = SITE_MEDIA_SLOTS.map((slot) => ({
    key: slot.key,
    label: slot.label,
    media: mediaByKey.get(slot.key) ?? null,
  }))

  return data
}

export const SiteMedia: GlobalConfig = {
  slug: 'site-media',
  label: 'Media del sitio',
  admin: {
    group: 'Contenido',
    description:
      'Reemplaza los placeholders de fotos y videos del sitio. Cada fila corresponde a un lugar fijo del frontend — sube el archivo ahí para que aparezca en la página. Si la dejas vacía, sigue mostrando el placeholder de siempre.',
  },
  hooks: {
    beforeChange: [reconcileSlots],
  },
  fields: [
    {
      name: 'slots',
      type: 'array',
      defaultValue: SITE_MEDIA_SLOTS.map((slot) => ({ key: slot.key, label: slot.label, media: null })),
      fields: [
        { name: 'key', type: 'text', required: true, admin: { readOnly: true } },
        { name: 'label', type: 'text', admin: { readOnly: true } },
        { name: 'media', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  access: {
    read: () => true,
    update: ({ req }) => req.user?.rol === 'admin',
  },
}
