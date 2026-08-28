# Got Fresh Breath — E-commerce

Sitio web y tienda en línea de Got Fresh Breath (dispensadores y consumibles de aromatización).
Construido sobre **Payload CMS 3** (admin + API) montado dentro de una sola app de **Next.js 16**
(App Router), con **Postgres** como base de datos.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Payload CMS 3** — admin panel, colecciones, auth, API REST/GraphQL, en el mismo origen que el frontend
- **Postgres** vía `@payloadcms/db-postgres`
- **Vercel Blob** para almacenamiento de media (con fallback a disco local si no hay `BLOB_READ_WRITE_TOKEN`)
- **PayPal** (`@paypal/react-paypal-js`) para checkout
- **Resend** para notificaciones por correo (nuevos leads/pedidos)
- **GSAP** para animaciones del frontend
- **Tailwind CSS 4**
- **Vitest** (integración) + **Playwright** (e2e)

## Requisitos

- Node `^18.20.2` o `>=20.9.0`
- pnpm `^9 || ^10 || ^11`
- Postgres (local, Docker, o remoto)

## Setup local

1. Clona el repo e instala dependencias:

   ```bash
   pnpm install
   ```

2. Copia las variables de entorno y complétalas (ver detalle abajo):

   ```bash
   cp .env.example .env
   ```

3. Levanta Postgres. La forma más simple es con Docker:

   ```bash
   docker-compose up -d
   ```

   O apunta `DATABASE_URL` a una instancia propia.

4. Corre las migraciones y levanta el servidor de desarrollo:

   ```bash
   pnpm migrate
   pnpm dev
   ```

5. Abre `http://localhost:3000` para el sitio, o `http://localhost:3000/admin` para el panel de
   Payload. La primera vez, el admin panel te guía para crear el primer usuario **admin**.

## Variables de entorno

Ver `.env.example` para el detalle y comentarios de cada una. Resumen:

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Sí | Cadena de conexión a Postgres |
| `PAYLOAD_SECRET` | Sí | Secreto usado por Payload para firmar sesiones/tokens |
| `NEXT_PUBLIC_SERVER_URL` | Sí | Origen público del sitio — restringe CORS/CSRF de Payload |
| `NEXT_PUBLIC_GTM_ID` | No | Contenedor de Google Tag Manager (GA4, Ads, etc.) |
| `RESEND_API_KEY` | No | Habilita el envío de correos de notificación |
| `RESEND_FROM_EMAIL` | No | Remitente; por defecto `onboarding@resend.dev` hasta verificar dominio propio |
| `NOTIFICATION_EMAIL` | No | Correo interno que recibe notificaciones de leads/pedidos |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` / `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | No | Sin ellas, `/carrito` oculta el botón de PayPal y solo ofrece transferencia/cotización |
| `PAYPAL_API_BASE` | No | Por defecto sandbox; usar `https://api-m.paypal.com` en producción |
| `CRM_WEBHOOK_URL` / `CRM_WEBHOOK_SECRET` | No | Notifica nuevos leads a un CRM externo; inactivo si no están configuradas |
| `BLOB_READ_WRITE_TOKEN` | No | Habilita subida de media a Vercel Blob; sin él, cae a disco local |

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo |
| `pnpm devsafe` | `dev` pero borrando `.next` antes (útil si el caché se corrompe) |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve el build de producción |
| `pnpm lint` | ESLint |
| `pnpm migrate` | Corre migraciones de Payload contra `DATABASE_URL` |
| `pnpm generate:types` | Regenera `src/payload-types.ts` a partir de las colecciones/globals |
| `pnpm generate:importmap` | Regenera el import map del admin panel |
| `pnpm test:int` | Tests de integración (Vitest) |
| `pnpm test:e2e` | Tests end-to-end (Playwright) |
| `pnpm test` | `test:int` + `test:e2e` |

## Estructura del proyecto

```
src/
├── app/
│   ├── (frontend)/        # Rutas públicas del sitio (Next.js App Router)
│   └── (payload)/         # Admin panel de Payload, montado en /admin
├── collections/           # Colecciones de Payload (ver abajo)
├── globals/               # Globals de Payload (contenido único, no listado)
├── actions/                # Server actions (auth, checkout, paypal, leads)
├── lib/                    # Utilidades compartidas (payload client, email, pricing, etc.)
├── components/admin/       # Componentes custom del admin panel
├── migrations/             # Migraciones de Payload (ver "Migraciones")
└── payload.config.ts       # Configuración central de Payload
```

### Colecciones

| Colección | Propósito | Notas |
| --- | --- | --- |
| `users` | Cuentas de usuario y auth | Roles: `admin`, `empresa`, `distribuidor`, `individual`. Un usuario no-admin no puede auto-asignarse `admin` ni `distribuidor` (ver `enforceDefaultRol` en `Users.ts`) |
| `products` | Catálogo de la tienda | Categorías `dispensador` / `consumible`; lectura pública, escritura solo admin |
| `orders` | Pedidos | El estado inicial siempre lo fuerza el servidor (nunca el cliente); soporta compra como invitado vía `accessToken` opaco; envía correos de confirmación al crearse |
| `leads` | Leads de los formularios del sitio (Sectores, Distribuidor, Contacto, Comodato) | Al crearse notifica por correo y, si está configurado, hace webhook al CRM |
| `clients` | Logos de clientes mostrados en el sitio | Lectura pública, escritura solo admin |
| `media` | Archivos subidos (imágenes, PDFs, video) | Sube a Vercel Blob si `BLOB_READ_WRITE_TOKEN` está presente; si no, a disco local |

### Globals

- **`site-media`** — reemplaza placeholders de fotos/video del sitio desde el admin, por "slot" fijo
  (la lista de slots vive en `src/lib/siteMediaSlots.ts`, no es editable desde el admin).

## Migraciones

Las migraciones de Payload viven en `src/migrations/`. Se corren automáticamente en CI
(`.github/workflows/migrate.yml`) cada vez que se hace push a cualquier rama con cambios en
`src/migrations/**`, contra la base definida en los secrets `DATABASE_URL` / `PAYLOAD_SECRET` del
repo. Para correrlas localmente: `pnpm migrate`.

## Tests

- `pnpm test:int` — Vitest, en `tests/int/`
- `pnpm test:e2e` — Playwright, en `tests/e2e/`

## Despliegue

Next.js estándar (`pnpm build && pnpm start`) o vía Docker (`Dockerfile` / `docker-compose.yml`
incluidos). Requiere Postgres y las variables de entorno descritas arriba.
