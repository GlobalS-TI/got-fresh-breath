'use client'

import type { FormEvent } from 'react'

import styles from './consultorios.module.css'

const WHATSAPP = '528135798655'

// El formulario no pasa por el servidor: arma el mensaje del pedido y abre WhatsApp con él.
// El utm_source se incluye como "Origen" para saber de qué campaña llegó el pedido.
export function PedidoForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    const valor = (campo: string) => String(datos.get(campo) ?? '').trim()

    const mensaje = [
      'Hola, quiero hacer un pedido de Got Fresh Breath.',
      '',
      `Nombre: ${valor('nombre')}`,
      `Consultorio: ${valor('consultorio')}`,
      `WhatsApp: ${valor('whatsapp')}`,
      `Correo: ${valor('correo')}`,
      `CP: ${valor('cp')}`,
      `Paquete: ${valor('paquete')}`,
      `Color: ${valor('color')}`,
      `Cantidad: ${valor('cantidad')}`,
      `Factura: ${valor('factura')}`,
      `Origen: ${new URLSearchParams(window.location.search).get('utm_source') || 'web'}`,
    ].join('\n')

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`, '_blank')
  }

  return (
    <form className={styles.formulario} onSubmit={handleSubmit}>
      <div className={styles.campo}>
        <label htmlFor="nombre" className={styles.etiqueta}>
          Nombre
        </label>
        <input id="nombre" name="nombre" type="text" placeholder="Dra. Ana López" className={styles.control} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="consultorio" className={styles.etiqueta}>
          Nombre del consultorio
        </label>
        <input
          id="consultorio"
          name="consultorio"
          type="text"
          placeholder="Clínica Dental Sonrisa"
          className={styles.control}
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="whatsapp" className={styles.etiqueta}>
          WhatsApp
        </label>
        <input id="whatsapp" name="whatsapp" type="tel" placeholder="81 1234 5678" className={styles.control} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="correo" className={styles.etiqueta}>
          Correo
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          placeholder="contacto@consultorio.com"
          className={styles.control}
        />
      </div>
      <div className={styles.campo}>
        <label htmlFor="cp" className={styles.etiqueta}>
          Código postal de entrega
        </label>
        <input id="cp" name="cp" type="text" placeholder="64000" className={styles.control} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="paquete" className={styles.etiqueta}>
          Paquete
        </label>
        <select id="paquete" name="paquete" className={styles.control}>
          <option>Kit de inicio</option>
          <option>Paquete de 3 botellas</option>
          <option>Caja completa (6 botellas)</option>
          <option>Suscripción</option>
        </select>
      </div>
      <div className={styles.campo}>
        <label htmlFor="color" className={styles.etiqueta}>
          Color del dispensador (kit)
        </label>
        <select id="color" name="color" className={styles.control}>
          <option>Blanco</option>
          <option>Negro</option>
          <option>Níquel (+$200)</option>
        </select>
      </div>
      <div className={styles.campo}>
        <label htmlFor="cantidad" className={styles.etiqueta}>
          Cantidad
        </label>
        <input id="cantidad" name="cantidad" type="number" defaultValue={1} min={1} className={styles.control} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="factura" className={styles.etiqueta}>
          ¿Requiere factura?
        </label>
        <select id="factura" name="factura" className={styles.control}>
          <option>Sí</option>
          <option>No</option>
        </select>
      </div>
      <button type="submit" className={styles.enviar}>
        Enviar pedido
      </button>
    </form>
  )
}
