'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import { checkRateLimit } from '@/lib/rate-limit'

export type AuthActionState = { error: string }

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rateLimit = await checkRateLimit('login', 5, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error }
  }

  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' }
  }

  const payload = await getPayloadClient()

  let token: string | undefined
  let exp: number | undefined

  try {
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
    token = result.token
    exp = result.exp
  } catch {
    return { error: 'Email o contraseña incorrectos.' }
  }

  if (!token || !exp) {
    return { error: 'No se pudo iniciar sesión.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('payload-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(exp * 1000),
  })

  redirect('/cuenta')
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rateLimit = await checkRateLimit('register', 3, 60_000)
  if (!rateLimit.allowed) {
    return { error: rateLimit.error }
  }

  const nombre = String(formData.get('nombre') || '').trim()
  const apellido = String(formData.get('apellido') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const confirmPassword = String(formData.get('confirmPassword') || '')
  const rol = String(formData.get('rol') || 'individual') === 'empresa' ? 'empresa' : 'individual'
  const empresa = String(formData.get('empresa') || '').trim()

  if (!nombre || !apellido || !email || !password) {
    return { error: 'Todos los campos son requeridos.' }
  }
  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' }
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { error: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.` }
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { error: `La contraseña no puede tener más de ${PASSWORD_MAX_LENGTH} caracteres.` }
  }
  if (rol === 'empresa' && !empresa) {
    return { error: 'El nombre de la empresa es requerido.' }
  }

  const payload = await getPayloadClient()

  try {
    await payload.create({
      collection: 'users',
      data: {
        nombre,
        apellido,
        email,
        password,
        rol,
        ...(rol === 'empresa' ? { empresa } : {}),
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : ''
    if (message.includes('duplicate') || message.includes('unique')) {
      return { error: 'Ya existe una cuenta con ese email.' }
    }
    return { error: 'No se pudo crear la cuenta.' }
  }

  return loginAction(_prevState, formData)
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  redirect('/login')
}
