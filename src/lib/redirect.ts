// Valida el destino de `?redirect=` después de login/registro. Solo se aceptan rutas internas
// ("/carrito", "/consultorios?x=1") — nunca URLs absolutas ni "//dominio.com", que el navegador
// trata como otro origen y convertirían el login en un open redirect.
export function safeRedirectPath(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null
  return value
}
