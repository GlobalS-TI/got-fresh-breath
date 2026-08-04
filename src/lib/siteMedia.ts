import { cache } from 'react'

import type { Media } from '@/payload-types'

import { getPayloadClient } from './payload'

export type SiteMediaMap = Record<string, Media | null>

// cache() deduplica dentro del mismo request de servidor — no importa
// cuántos componentes llamen getSiteMediaSlot en la misma página, el global
// solo se consulta una vez.
export const getSiteMediaMap = cache(async (): Promise<SiteMediaMap> => {
  const payload = await getPayloadClient()
  const siteMedia = await payload.findGlobal({ slug: 'site-media', depth: 1 })

  const map: SiteMediaMap = {}
  for (const slot of siteMedia.slots ?? []) {
    map[slot.key] = typeof slot.media === 'object' && slot.media !== null ? slot.media : null
  }
  return map
})

export async function getSiteMediaSlot(key: string): Promise<Media | null> {
  const map = await getSiteMediaMap()
  return map[key] ?? null
}
