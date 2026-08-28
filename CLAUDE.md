# Claude Code

Got Fresh Breath — e-commerce de dispensadores/consumibles de aromatización sobre Payload CMS 3 +
Next.js 16 (App Router), Postgres. Ver `README.md` para setup, scripts y estructura general.

Este proyecto usa el skill de Payload CMS en `.claude/skills/payload/`.
Empieza por `.claude/skills/payload/SKILL.md` para referencia rápida, luego revisa
`.claude/skills/payload/reference/` para docs detallados.

## Convenciones del proyecto

- **Idioma**: campos de Payload, labels del admin, mensajes al usuario y contenido de negocio van
  en **español** (`nombre`, `pedido`, `estado`, etc.). Código, nombres de funciones/variables y
  comentarios van en español también, siguiendo el patrón ya presente en `src/collections/` — no
  mezclar a inglés al tocar estos archivos.
- **Roles de usuario** (`users.rol`): `admin`, `empresa`, `distribuidor`, `individual`. Un usuario
  no-admin nunca puede auto-asignarse `admin`, y `distribuidor` solo lo otorga un admin manualmente
  (flujo: lead del formulario Distribuidor → conversión manual). Ver `enforceDefaultRol` en
  `src/collections/Users.ts` antes de tocar el flujo de registro/roles.
- **Access control**: el patrón estándar en colecciones es `req.user?.rol === 'admin'` para
  escritura, con lectura pública o filtrada por dueño (`{ id: { equals: req.user.id } }` /
  `{ usuario: { equals: req.user.id } }`). Sigue ese patrón al agregar colecciones nuevas en vez de
  introducir uno distinto.
- **Nunca confiar en estado enviado por el cliente** en operaciones sensibles (ver
  `enforceInitialStatus` en `Orders.ts`): el estado de un pedido solo puede pasar a `pagado` vía
  `context.paymentVerified`, fijado por el propio server action después de verificar el pago con
  PayPal — nunca desde el body de una request pública.
- **Compra como invitado**: los pedidos de invitados usan un `accessToken` opaco (UUID) para que
  puedan ver su confirmación en `/pedido/[id]` sin exponer el ID secuencial. Cualquier lógica nueva
  de acceso a pedidos de invitados debe seguir usando ese token, no el ID.
- **Server actions** (`src/actions/`) son la puerta de entrada para mutaciones desde el frontend
  (login/registro, checkout, captura de PayPal, envío de leads) — el admin panel usa la Local API
  de Payload directamente. `checkRateLimit` (`src/lib/rate-limit.ts`) protege endpoints sensibles
  como login; es rate limiting en memoria por proceso (no compartido entre instancias) — si el
  proyecto pasa a correr en múltiples instancias, hay que migrarlo a un backend compartido antes de
  confiar en él.
- **Media**: sube a Vercel Blob solo si `BLOB_READ_WRITE_TOKEN` está presente; en local normalmente
  cae a disco. El upload multipart custom (`src/components/admin/MediaMultipartUploadHandler.tsx`)
  existe porque el plugin oficial limita a ~4.5MB — no lo quites sin revisar el comentario extenso
  en `payload.config.ts` sobre el orden de `providers`.
- **Tipos generados**: después de cambiar cualquier colección/global, correr `pnpm generate:types`
  antes de usar los tipos en `src/payload-types.ts` — si no, quedan desincronizados.
- **Migraciones**: se corren solas en CI al hacer push con cambios en `src/migrations/**` (ver
  `.github/workflows/migrate.yml`). No es necesario correrlas manualmente en producción, pero sí
  crearlas localmente con la CLI de Payload cuando cambie el schema.
