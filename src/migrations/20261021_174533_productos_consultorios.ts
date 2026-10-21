import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Schema del checkout con envío e IVA. Los productos de la landing /consultorios se crean en la
// migración siguiente (20261021_220612_productos_consultorios_imagen_estatica), sin Media/Blob.
// IF (NOT) EXISTS: la base de producción tuvo `pnpm dev` (push de schema), así que algunas
// columnas pueden existir ya.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "costo_envio" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "orders_items" ADD COLUMN IF NOT EXISTS "costo_envio_unitario" numeric;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "subtotal" numeric;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "envio" numeric;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "iva" numeric;
  ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "requiere_factura" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN IF EXISTS "costo_envio";
  ALTER TABLE "orders_items" DROP COLUMN IF EXISTS "costo_envio_unitario";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "subtotal";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "envio";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "iva";
  ALTER TABLE "orders" DROP COLUMN IF EXISTS "requiere_factura";`)
}
