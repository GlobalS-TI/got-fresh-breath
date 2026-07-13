import { getPayload } from 'payload'

import config from '../src/payload.config.js'

const PRODUCTS = [
  {
    nombre: 'Dispensador Nickel',
    slug: 'dispensador-nickel',
    descripcion:
      'Su acabado metálico está diseñado para integrarse con total naturalidad en corporativos modernos y plantas industriales de alta densidad, proyectando una imagen de cuidado absoluto y profesionalismo en las áreas de uso intensivo.',
    descripcionCorta: 'Acabado metálico para corporativos y plantas industriales.',
    precio: 1850,
    categoria: 'dispensador' as const,
  },
  {
    nombre: 'Dispensador Negro',
    slug: 'dispensador-negro',
    descripcion:
      'Diseñado específicamente para hoteles de alta gama, corporativos boutique y marcas que entienden que la reputación y el prestigio de una empresa se defienden en los detalles más exclusivos.',
    descripcionCorta: 'Para hoteles de alta gama y corporativos boutique.',
    precio: 1650,
    categoria: 'dispensador' as const,
  },
  {
    nombre: 'Dispensador Blanco',
    slug: 'dispensador-blanco',
    descripcion:
      'Su estética limpia y discreta se integra a la perfección en el sector salud, laboratorios corporativos y oficinas de concepto abierto que buscan proyectar un ambiente luminoso, transparente y sumamente pulcro.',
    descripcionCorta: 'Estética limpia para sector salud y oficinas.',
    precio: 1650,
    categoria: 'dispensador' as const,
  },
  {
    nombre: 'Cajas de Enjuague Bucal y Vasos',
    slug: 'cajas-de-enjuague',
    descripcion:
      'Garantiza la continuidad de tu estándar corporativo sin mover un solo dedo. Este kit integral asegura 600 interacciones completamente protegidas, eliminando la inseguridad personal después de comer o justo antes de una junta clave. Incluye nuestra fórmula premium sabor menta ligera (100% libre de alcohol) y vasos desechables listos para la acción.',
    descripcionCorta: '600 interacciones: enjuague premium sabor menta ligera + vasos.',
    precio: 1650,
    categoria: 'consumible' as const,
  },
]

async function seedProducts() {
  const payload = await getPayload({ config })

  for (const product of PRODUCTS) {
    await payload.delete({
      collection: 'products',
      where: { slug: { equals: product.slug } },
    })

    await payload.create({
      collection: 'products',
      data: product,
    })

    console.log(`Seeded: ${product.nombre}`)
  }

  process.exit(0)
}

seedProducts()
