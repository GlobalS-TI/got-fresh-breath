import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { toCheckoutUser } from '@/lib/checkout-user'
import { getPayloadClient } from '@/lib/payload'
import { esColor, esPaquete, SLUGS_CONSULTORIOS } from '@/lib/productos-consultorios'
import { getSession } from '@/lib/session'

import { PedidoForm, type ProductoLanding } from './PedidoForm'
import styles from './consultorios.module.css'

export const metadata: Metadata = {
  title: 'Got Fresh Breath para consultorios dentales',
  description:
    'Dispensador de enjuague bucal sin alcohol para consultorios dentales. Kit de inicio, paquetes de recarga y envío a todo México.',
}

const WHATSAPP_URL = 'https://wa.me/528135798655'
// La suscripción todavía no se cobra en línea (requiere PayPal Subscriptions) — se atiende por WhatsApp.
const WHATSAPP_SUSCRIPCION_URL = `${WHATSAPP_URL}?text=${encodeURIComponent(
  'Hola, me interesa la suscripción de Got Fresh Breath: una caja de 6 botellas cada 2 o 3 meses.',
)}`

// TODO: reemplazar por los días hábiles reales de entrega antes de publicar.
const DIAS_ENTREGA = '[N]'

const colores = [
  {
    nombre: 'Blanco',
    imagen: '/consultorios/blanco.png',
    alt: 'Dispensador Got Fresh Breath color blanco',
    precioKit: '$1,390',
    precioRegular: '$1,650',
  },
  {
    nombre: 'Negro',
    imagen: '/consultorios/negro.png',
    alt: 'Dispensador Got Fresh Breath color negro',
    precioKit: '$1,390',
    precioRegular: '$1,650',
  },
  {
    nombre: 'Níquel',
    imagen: '/consultorios/niquel.png',
    alt: 'Dispensador Got Fresh Breath acabado níquel',
    precioKit: '$1,590',
    precioRegular: '$1,850',
    premium: true,
  },
]

const pasos = [
  {
    titulo: 'Elige tu paquete',
    texto: 'Kit de inicio la primera vez; después, paquete de 3 o caja completa de 6.',
  },
  {
    titulo: 'Paga por adelantado',
    texto: 'Tarjeta o transferencia. Facturamos a nombre de tu consultorio.',
  },
  {
    titulo: 'Recibe en tu consultorio',
    texto: `Envío a todo México en ${DIAS_ENTREGA} días hábiles. El dispensador se instala con dos tornillos.`,
  },
]

const preguntas = [
  {
    pregunta: '¿El enjuague tiene alcohol?',
    respuesta: 'No. Es un enjuague sin alcohol, en dosis individual con su propio vaso.',
  },
  {
    pregunta: '¿Cuántos usos da una botella?',
    respuesta: '100 enjuagues por botella. Cada botella incluye sus 100 vasos individuales.',
  },
  {
    pregunta: '¿Cuánto cuesta el envío?',
    respuesta:
      '$125 + IVA por kit o paquete de 3 y $170 + IVA por caja de 6. Si necesitas 6 botellas, la caja te ahorra $310 + IVA contra dos paquetes de 3.',
  },
  {
    pregunta: '¿Y si necesito más de un dispensador?',
    respuesta:
      'Pide un kit de inicio por cada dispensador. Para 3 o más dispensadores, escríbenos por WhatsApp y te hacemos una cotización especial.',
  },
  {
    pregunta: '¿Facturan?',
    respuesta:
      'Sí. Marca «Requiero factura» al hacer tu pedido y captura tus datos fiscales; se guardan en tu cuenta para los siguientes pedidos.',
  },
]

function Precio({ monto }: { monto: string }) {
  return (
    <div className={styles.precio}>
      {monto}
      <span className={styles.precioIva}> + IVA</span>
    </div>
  )
}

async function getProductosLanding(): Promise<ProductoLanding[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { in: SLUGS_CONSULTORIOS }, activo: { equals: true } },
    limit: SLUGS_CONSULTORIOS.length,
    depth: 0,
  })
  return docs.map((p) => ({
    productId: p.id,
    slug: p.slug,
    nombre: p.nombre,
    precio: p.precio,
    costoEnvio: p.costoEnvio ?? 0,
    categoria: p.categoria,
  }))
}

export default async function ConsultoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ paquete?: string; color?: string; cantidad?: string }>
}) {
  const params = await searchParams
  const [user, productos] = await Promise.all([getSession(), getProductosLanding()])

  // Selección inicial desde la URL: la usan los botones "Pedir ..." de las tarjetas y el regreso
  // después de iniciar sesión / crear cuenta.
  const cantidadParam = Math.floor(Number(params.cantidad))
  const inicial = {
    paquete: esPaquete(params.paquete) ? params.paquete : ('kit' as const),
    color: esColor(params.color) ? params.color : ('blanco' as const),
    cantidad: cantidadParam >= 1 && cantidadParam <= 99 ? cantidadParam : 1,
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.header}>
        <div className={styles.headerInterior}>
          <Image
            src="/consultorios/logo-gfb.png"
            alt="Got Fresh Breath"
            width={301}
            height={48}
            className={styles.logo}
            priority
          />
          <nav className={styles.nav}>
            <a href="#paquetes" className={styles.navLink}>
              Paquetes
            </a>
            <a href="#colores" className={styles.navLink}>
              Colores
            </a>
            <a href="#como-funciona" className={styles.navLink}>
              Cómo funciona
            </a>
            <a href="#preguntas" className={styles.navLink}>
              Preguntas
            </a>
            <a href="#pedido" className={`${styles.boton} ${styles.botonNav}`}>
              Hacer pedido
            </a>
          </nav>
        </div>
      </header>

      <section className={styles.fondoSuave}>
        <div className={styles.hero}>
          <div className={styles.heroTexto}>
            <div className={styles.eyebrow}>Para consultorios dentales</div>
            <h1 className={styles.titulo}>El detalle que tus pacientes recuerdan.</h1>
            <p className={styles.heroLead}>
              Dispensador de enjuague bucal para el baño o la sala de espera de tu consultorio. Sin
              alcohol, con vaso individual y con llave. Envío a todo México.
            </p>
            <div className={styles.heroAcciones}>
              <a href="#paquetes" className={`${styles.boton} ${styles.botonHero}`}>
                Ver paquetes
              </a>
              <a href={WHATSAPP_URL} className={`${styles.botonContorno} ${styles.botonHero}`}>
                Pedir por WhatsApp
              </a>
            </div>
          </div>
          <Image
            src="/consultorios/dispensador-instalado.jpg"
            alt="Dispensador Got Fresh Breath instalado en la pared"
            width={320}
            height={392}
            className={styles.heroImagen}
            priority
          />
        </div>
      </section>

      <section id="paquetes">
        <div className={`${styles.contenedor} ${styles.contenedorPaquetes}`}>
          <div className={styles.encabezado}>
            <h2 className={styles.h2}>Paquetes</h2>
            <p className={styles.subtitulo}>
              Empieza con el kit y después pide solo las recargas que necesites. Precios más IVA.
            </p>
          </div>
          <div className={styles.rejilla}>
            <div className={styles.tarjeta}>
              <div className={styles.etiquetaTarjeta}>Para empezar</div>
              <h3 className={styles.h3}>Kit de inicio</h3>
              <Precio monto="$1,390" />
              <div className={styles.ahorro}>
                <div className={styles.pastilla}>El dispensador te sale en solo $400</div>
                <div className={styles.notaAhorro}>
                  Precio regular del dispensador: <s>$1,650</s>. Ahorras $1,250.
                </div>
              </div>
              <ul className={styles.lista}>
                <li>Dispensador de pared con llave en blanco o negro (níquel: +$200)</li>
                <li>3 botellas de enjuague sin alcohol de 1.5 L</li>
                <li>300 vasos individuales</li>
                <li>Envío: $125 + IVA</li>
              </ul>
              <Link href="?paquete=kit#pedido" className={`${styles.boton} ${styles.botonTarjeta}`}>
                Pedir kit
              </Link>
            </div>

            <div className={styles.tarjeta}>
              <div className={styles.etiquetaTarjeta}>Recarga</div>
              <h3 className={styles.h3}>Paquete de 3 botellas</h3>
              <Precio monto="$990" />
              <ul className={styles.lista}>
                <li>3 botellas de enjuague sin alcohol de 1.5 L</li>
                <li>300 vasos individuales</li>
                <li>$330 por botella</li>
                <li>Envío: $125 + IVA por paquete</li>
              </ul>
              <Link
                href="?paquete=paquete3#pedido"
                className={`${styles.botonContorno} ${styles.botonTarjeta}`}
              >
                Pedir recarga
              </Link>
            </div>

            <div className={`${styles.tarjeta} ${styles.tarjetaDestacada}`}>
              <div className={styles.insignia}>Mejor precio por botella</div>
              <h3 className={styles.h3}>Caja completa · 6 botellas</h3>
              <Precio monto="$1,750" />
              <ul className={styles.lista}>
                <li>6 botellas de enjuague sin alcohol de 1.5 L</li>
                <li>600 vasos individuales</li>
                <li>$292 por botella</li>
                <li>Envío: $170 + IVA por caja</li>
              </ul>
              <Link href="?paquete=caja6#pedido" className={`${styles.boton} ${styles.botonTarjeta}`}>
                Pedir caja
              </Link>
            </div>
          </div>
          <div className={styles.aviso}>
            <strong>¿Necesitas 6 botellas?</strong> Pide la caja completa y ahorra $310 + IVA contra
            dos paquetes de 3 (producto y envío).
          </div>
          <div className={styles.suscripcion}>
            <div className={styles.suscripcionTexto}>
              <div className={styles.suscripcionTitulo}>
                Suscripción: una caja de 6 cada 2 o 3 meses, tú eliges
              </div>
              <div className={styles.suscripcionDetalle}>
                Mismo precio de caja, sin tener que reordenar. Sin preocuparte por reordenar; cancela
                cuando quieras.
              </div>
            </div>
            <a href={WHATSAPP_SUSCRIPCION_URL} className={styles.botonClaro}>
              Suscribirme
            </a>
          </div>
        </div>
      </section>

      <section id="colores" className={styles.fondoSuave}>
        <div className={styles.contenedor}>
          <div className={styles.encabezado}>
            <h2 className={styles.h2}>Elige tu color</h2>
            <p className={styles.subtitulo}>
              Dispensador de pared con llave, indicador de nivel iluminado y portavasos integrado.
            </p>
          </div>
          <div className={styles.rejilla}>
            {colores.map((color) => (
              <div key={color.nombre} className={styles.tarjetaColor}>
                {color.premium ? (
                  <div className={styles.insigniaPremium}>Premium</div>
                ) : (
                  <div className={styles.espaciadorInsignia} />
                )}
                <Image
                  src={color.imagen}
                  alt={color.alt}
                  width={377}
                  height={721}
                  className={styles.imagenColor}
                />
                <div className={styles.infoColor}>
                  <div className={styles.nombreColor}>{color.nombre}</div>
                  <div className={styles.precioColor}>
                    En kit: <strong>{color.precioKit} + IVA</strong> con 3 botellas
                  </div>
                  <div className={styles.precioRegular}>
                    Precio regular del dispensador: {color.precioRegular} + IVA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona">
        <div className={styles.contenedor}>
          <h2 className={styles.h2}>Cómo funciona</h2>
          <div className={styles.pasos}>
            {pasos.map((paso, i) => (
              <div key={paso.titulo} className={styles.paso}>
                <div className={styles.numeroPaso}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.tituloPaso}>{paso.titulo}</div>
                <div className={styles.textoPaso}>{paso.texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pedido" className={styles.fondoSuave}>
        <div className={styles.pedido}>
          <div className={styles.pedidoTexto}>
            <h2 className={styles.h2}>Haz tu pedido</h2>
            <p className={styles.pedidoLead}>
              Elige tu paquete y paga en línea con PayPal o tarjeta, o solicita transferencia o
              cotización. Necesitas una cuenta para hacer tu pedido.
            </p>
          </div>
          {/* key: los botones "Pedir ..." cambian la selección vía URL — remonta el formulario
              para que tome la nueva selección inicial. */}
          <PedidoForm
            key={`${inicial.paquete}-${inicial.color}-${inicial.cantidad}`}
            user={toCheckoutUser(user)}
            productos={productos}
            inicial={inicial}
            whatsappUrl={WHATSAPP_URL}
          />
        </div>
      </section>

      <section id="preguntas">
        <div className={`${styles.contenedor} ${styles.contenedorPreguntas}`}>
          <h2 className={styles.h2}>Preguntas frecuentes</h2>
          <div className={styles.preguntas}>
            {preguntas.map((item) => (
              <div key={item.pregunta} className={styles.pregunta}>
                <div className={styles.preguntaTitulo}>{item.pregunta}</div>
                <div className={styles.preguntaRespuesta}>{item.respuesta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInterior}>
          <div>Got Fresh Breath · Distribuidor master en México: Global Supplier MTY</div>
          <div className={styles.footerLinks}>
            <a href="mailto:ventas@gotfreshbreath.mx">ventas@gotfreshbreath.mx</a>
            <a href={WHATSAPP_URL}>WhatsApp 81 3579 8655</a>
            <a href="/aviso-de-privacidad">Aviso de privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
