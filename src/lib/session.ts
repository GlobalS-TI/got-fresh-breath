import { headers as getHeaders } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export async function getSession() {
  const headers = await getHeaders()
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers })
  return user
}
