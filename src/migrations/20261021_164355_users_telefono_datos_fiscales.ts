import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Idempotente (IF NOT EXISTS / duplicate_object): la base de producción tuvo `pnpm dev`, que
// empuja el schema directo, así que estas columnas/enums pueden existir ya sin que la migración
// esté registrada en payload_migrations.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_users_datos_fiscales_regimen_fiscal" AS ENUM('601', '603', '605', '606', '608', '612', '616', '621', '625', '626');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_users_datos_fiscales_uso_cfdi" AS ENUM('G01', 'G03', 'S01');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "telefono" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "datos_fiscales_rfc" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "datos_fiscales_razon_social" varchar;
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "datos_fiscales_regimen_fiscal" "enum_users_datos_fiscales_regimen_fiscal";
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "datos_fiscales_uso_cfdi" "enum_users_datos_fiscales_uso_cfdi";
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "datos_fiscales_cp_fiscal" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN "telefono";
  ALTER TABLE "users" DROP COLUMN "datos_fiscales_rfc";
  ALTER TABLE "users" DROP COLUMN "datos_fiscales_razon_social";
  ALTER TABLE "users" DROP COLUMN "datos_fiscales_regimen_fiscal";
  ALTER TABLE "users" DROP COLUMN "datos_fiscales_uso_cfdi";
  ALTER TABLE "users" DROP COLUMN "datos_fiscales_cp_fiscal";
  DROP TYPE "public"."enum_users_datos_fiscales_regimen_fiscal";
  DROP TYPE "public"."enum_users_datos_fiscales_uso_cfdi";`)
}
