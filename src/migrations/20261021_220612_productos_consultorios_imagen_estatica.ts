import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Productos de la landing /consultorios (precios y envío SIN IVA, igual que el resto de la
// tienda). Las fotos de los kits son las mismas de la landing: viven en public/consultorios/ y se
// sirven con el deploy (campo imagen_estatica), así que no se necesita Media ni Vercel Blob.
//
// SQL directo en lugar de la Local API a propósito: una migración no debe depender de cómo esté
// definida la colección en el futuro. Copia fija de los datos; los slugs deben coincidir con
// src/lib/productos-consultorios.ts. Idempotente: ON CONFLICT (slug) no duplica ni pisa
// productos que alguien ya haya creado/editado en el admin.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "imagen_estatica" varchar;

  INSERT INTO "products"
    ("nombre", "slug", "descripcion", "descripcion_corta", "precio", "costo_envio", "categoria", "imagen_estatica", "activo")
  VALUES
    ('Kit de inicio · Dispensador blanco', 'kit-inicio-blanco',
     E'Kit de inicio para consultorio:\n- Dispensador de pared con llave, color blanco\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L\n- 300 vasos individuales',
     'Dispensador blanco + 3 botellas de 1.5 L + 300 vasos', 1390, 125, 'dispensador', '/consultorios/blanco.png', true),
    ('Kit de inicio · Dispensador negro', 'kit-inicio-negro',
     E'Kit de inicio para consultorio:\n- Dispensador de pared con llave, color negro\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L\n- 300 vasos individuales',
     'Dispensador negro + 3 botellas de 1.5 L + 300 vasos', 1390, 125, 'dispensador', '/consultorios/negro.png', true),
    ('Kit de inicio · Dispensador níquel', 'kit-inicio-niquel',
     E'Kit de inicio para consultorio:\n- Dispensador de pared con llave, acabado níquel (premium)\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L\n- 300 vasos individuales',
     'Dispensador níquel + 3 botellas de 1.5 L + 300 vasos', 1590, 125, 'dispensador', '/consultorios/niquel.png', true),
    ('Paquete de 3 botellas', 'paquete-3-botellas',
     E'Recarga para tu dispensador:\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L (100 enjuagues c/u)\n- 300 vasos individuales',
     '3 botellas de 1.5 L + 300 vasos', 990, 125, 'consumible', NULL, true),
    ('Caja completa · 6 botellas', 'caja-6-botellas',
     E'Caja completa de recarga:\n- 6 botellas de enjuague bucal sin alcohol de 1.5 L (100 enjuagues c/u)\n- 600 vasos individuales',
     '6 botellas de 1.5 L + 600 vasos — mejor precio por botella', 1750, 170, 'consumible', NULL, true)
  ON CONFLICT ("slug") DO NOTHING;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DELETE FROM "products" WHERE "slug" IN
    ('kit-inicio-blanco', 'kit-inicio-negro', 'kit-inicio-niquel', 'paquete-3-botellas', 'caja-6-botellas');
  ALTER TABLE "products" DROP COLUMN IF EXISTS "imagen_estatica";`)
}
