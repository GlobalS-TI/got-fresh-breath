import path from 'path'

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Productos de la landing /consultorios (precios y envío SIN IVA, igual que el resto de la
// tienda). Copia fija de los datos a propósito: una migración no debe cambiar si después se
// edita código de la app. Los slugs deben coincidir con src/lib/productos-consultorios.ts.
const PRODUCTOS = [
  {
    slug: 'kit-inicio-blanco',
    nombre: 'Kit de inicio · Dispensador blanco',
    imagen: 'blanco.png',
    alt: 'Dispensador Got Fresh Breath color blanco',
    precio: 1390,
    costoEnvio: 125,
    categoria: 'dispensador' as const,
  },
  {
    slug: 'kit-inicio-negro',
    nombre: 'Kit de inicio · Dispensador negro',
    imagen: 'negro.png',
    alt: 'Dispensador Got Fresh Breath color negro',
    precio: 1390,
    costoEnvio: 125,
    categoria: 'dispensador' as const,
  },
  {
    slug: 'kit-inicio-niquel',
    nombre: 'Kit de inicio · Dispensador níquel',
    imagen: 'niquel.png',
    alt: 'Dispensador Got Fresh Breath acabado níquel',
    precio: 1590,
    costoEnvio: 125,
    categoria: 'dispensador' as const,
  },
  {
    slug: 'paquete-3-botellas',
    nombre: 'Paquete de 3 botellas',
    imagen: null,
    alt: null,
    precio: 990,
    costoEnvio: 125,
    categoria: 'consumible' as const,
  },
  {
    slug: 'caja-6-botellas',
    nombre: 'Caja completa · 6 botellas',
    imagen: null,
    alt: null,
    precio: 1750,
    costoEnvio: 170,
    categoria: 'consumible' as const,
  },
]

const DESCRIPCIONES: Record<string, { descripcion: string; descripcionCorta: string }> = {
  'kit-inicio-blanco': {
    descripcionCorta: 'Dispensador blanco + 3 botellas de 1.5 L + 300 vasos',
    descripcion:
      'Kit de inicio para consultorio:\n- Dispensador de pared con llave, color blanco\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L\n- 300 vasos individuales',
  },
  'kit-inicio-negro': {
    descripcionCorta: 'Dispensador negro + 3 botellas de 1.5 L + 300 vasos',
    descripcion:
      'Kit de inicio para consultorio:\n- Dispensador de pared con llave, color negro\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L\n- 300 vasos individuales',
  },
  'kit-inicio-niquel': {
    descripcionCorta: 'Dispensador níquel + 3 botellas de 1.5 L + 300 vasos',
    descripcion:
      'Kit de inicio para consultorio:\n- Dispensador de pared con llave, acabado níquel (premium)\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L\n- 300 vasos individuales',
  },
  'paquete-3-botellas': {
    descripcionCorta: '3 botellas de 1.5 L + 300 vasos',
    descripcion:
      'Recarga para tu dispensador:\n- 3 botellas de enjuague bucal sin alcohol de 1.5 L (100 enjuagues c/u)\n- 300 vasos individuales',
  },
  'caja-6-botellas': {
    descripcionCorta: '6 botellas de 1.5 L + 600 vasos — mejor precio por botella',
    descripcion:
      'Caja completa de recarga:\n- 6 botellas de enjuague bucal sin alcohol de 1.5 L (100 enjuagues c/u)\n- 600 vasos individuales',
  },
}

// Las imágenes viven en el repo (las mismas que usa la landing) y se suben a Media.
const IMAGENES_DIR = path.resolve(process.cwd(), 'public/consultorios')

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "costo_envio" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "orders_items" ADD COLUMN "costo_envio_unitario" numeric;
  ALTER TABLE "orders" ADD COLUMN "subtotal" numeric;
  ALTER TABLE "orders" ADD COLUMN "envio" numeric;
  ALTER TABLE "orders" ADD COLUMN "iva" numeric;
  ALTER TABLE "orders" ADD COLUMN "requiere_factura" boolean DEFAULT false;`)

  // En GitHub Actions sin Vercel Blob, Media escribiría al disco del runner (que se borra al
  // terminar) y los productos quedarían apuntando a imágenes inexistentes. Mejor fallar y que
  // la transacción revierta todo.
  if (process.env.CI && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'Falta BLOB_READ_WRITE_TOKEN: esta migración sube imágenes a Media. Agrega el secret al repo y vuelve a correr el workflow.',
    )
  }

  for (const producto of PRODUCTOS) {
    // Idempotente: si alguien ya creó el producto a mano en el admin, no se duplica.
    const existente = await payload.find({
      collection: 'products',
      where: { slug: { equals: producto.slug } },
      limit: 1,
      req,
    })
    if (existente.totalDocs > 0) continue

    const imagenes = []
    if (producto.imagen) {
      const media = await payload.create({
        collection: 'media',
        data: { alt: producto.alt },
        filePath: path.join(IMAGENES_DIR, producto.imagen),
        req,
      })
      imagenes.push({ imagen: media.id })
    }

    await payload.create({
      collection: 'products',
      data: {
        slug: producto.slug,
        nombre: producto.nombre,
        precio: producto.precio,
        costoEnvio: producto.costoEnvio,
        categoria: producto.categoria,
        ...DESCRIPCIONES[producto.slug],
        imagenes,
        activo: true,
      },
      req,
    })
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { in: PRODUCTOS.map((p) => p.slug) } },
    limit: PRODUCTOS.length,
    depth: 0,
    req,
  })
  for (const producto of docs) {
    const mediaIds = (producto.imagenes ?? []).map((i) => (typeof i.imagen === 'object' ? i.imagen.id : i.imagen))
    await payload.delete({ collection: 'products', id: producto.id, req })
    for (const id of mediaIds) {
      await payload.delete({ collection: 'media', id, req })
    }
  }

  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "costo_envio";
  ALTER TABLE "orders_items" DROP COLUMN "costo_envio_unitario";
  ALTER TABLE "orders" DROP COLUMN "subtotal";
  ALTER TABLE "orders" DROP COLUMN "envio";
  ALTER TABLE "orders" DROP COLUMN "iva";
  ALTER TABLE "orders" DROP COLUMN "requiere_factura";`)
}
