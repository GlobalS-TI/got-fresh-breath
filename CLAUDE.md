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
- **Todo pedido requiere cuenta**: ya no hay compra como invitado. Los server actions de checkout y
  PayPal exigen sesión y teléfono vía `requireCheckoutUser` (`src/lib/checkout-user.ts`), y
  `orders.access.create` es solo-admin para que nadie cree pedidos con un POST directo a
  `/api/orders`. Los pedidos **históricos** de invitado conservan su `accessToken` opaco (UUID) para
  verse en `/pedido/[id]` sin exponer el ID secuencial — no quitar esa lógica.
- **Precios sin IVA**: `products.precio` y `products.costoEnvio` (por unidad) se guardan **sin
  IVA**. El total de un pedido (productos + envío + 16% de IVA) se calcula únicamente con
  `calcularTotales` (`src/lib/precios.ts`), que usan tanto `resolveCartItems` en el servidor como la
  UI del checkout — no recalcular totales por otro lado.
- **Un solo checkout (lógica)**: todo pedido se crea con `checkoutAction` / los actions de PayPal,
  con `PaypalCheckout` (`src/components/PaypalCheckout.tsx`) para los botones y `calcularTotales`
  para el desglose. La presentación puede variar: `/carrito` usa `CheckoutForm` y la landing
  `/consultorios` su propio formulario (`PedidoForm`) con el diseño de la landing. Landings nuevas
  pueden tener su UI, pero nunca su propia lógica de pedido/cobro. Antes de capturar un pago,
  `capturePaypalOrderAction` verifica que el monto de la orden de PayPal sea igual al total.
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
- **Migraciones**: el workflow `.github/workflows/migrate.yml` es **solo manual**
  (`workflow_dispatch`) — un push nunca migra la base. Después de mergear a `main` una rama con
  migraciones, hay que correr el workflow desde Actions. Las migraciones se crean localmente con la
  CLI de Payload cuando cambie el schema. Las migraciones no deben subir archivos a Media (en CI
  irían al disco del runner sin Blob): para fotos que viven en el repo usa el campo
  `products.imagenEstatica` (ruta en `public/`), y lee las imágenes con `imagenesDeProducto`
  (`src/lib/producto-imagen.ts`).
  **Nunca correr `pnpm dev` contra la base de producción**: Payload empuja el schema directo y
  deja una marca (`batch = -1` en `payload_migrations`) que bloquea `payload migrate` con un prompt
  interactivo. El workflow tiene la casilla `limpiar_marca_dev_mode` para quitarla. Por lo mismo,
  las migraciones nuevas deben usar `ADD COLUMN IF NOT EXISTS` / `DROP COLUMN IF EXISTS` (y
  `CREATE TYPE` dentro de un bloque que ignore `duplicate_object`).
