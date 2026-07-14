import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

import { notifyCrm } from '@/lib/crm-webhook'
import { escapeHtml, NOTIFICATION_EMAIL, sendEmail } from '@/lib/email'

const TIPO_LABELS: Record<string, string> = {
  sectores: 'Formulario de Sectores',
  distribuidor: 'Formulario de Distribuidor',
  contacto: 'Formulario de Contacto',
  comodato: 'Comodato (Hero)',
}

const notifyNewLead: CollectionAfterChangeHook = async ({ doc, operation }) => {
  if (operation !== 'create') return doc

  const tipoLabel = TIPO_LABELS[doc.tipo] ?? doc.tipo

  await sendEmail({
    to: NOTIFICATION_EMAIL,
    // El subject no admite HTML, pero igual se sanea por consistencia y para evitar inyección de headers.
    subject: `Nuevo lead: ${tipoLabel} — ${escapeHtml(doc.nombre)}`,
    html: `
      <h2>Nuevo lead recibido</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(doc.nombre)}</p>
      <p><strong>Email:</strong> ${escapeHtml(doc.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(doc.telefono) || '—'}</p>
      <p><strong>Origen:</strong> ${escapeHtml(tipoLabel)}</p>
      ${doc.sector ? `<p><strong>Sector:</strong> ${escapeHtml(doc.sector)}</p>` : ''}
      ${doc.notas ? `<p><strong>Notas:</strong> ${escapeHtml(doc.notas)}</p>` : ''}
    `,
  })

  await notifyCrm({
    id: doc.id,
    nombre: doc.nombre,
    email: doc.email,
    telefono: doc.telefono,
    tipo: doc.tipo,
    sector: doc.sector,
    notas: doc.notas,
    createdAt: doc.createdAt,
  })

  return doc
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'email', 'tipo', 'sector', 'createdAt'],
    group: 'CRM',
  },
  hooks: {
    afterChange: [notifyNewLead],
  },
  fields: [
    { name: 'nombre', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'telefono', type: 'text', label: 'Teléfono' },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      label: 'Origen del lead',
      options: [
        { label: 'Formulario de Sectores', value: 'sectores' },
        { label: 'Formulario de Distribuidor', value: 'distribuidor' },
        { label: 'Formulario de Contacto', value: 'contacto' },
        { label: 'Comodato (Hero)', value: 'comodato' },
      ],
    },
    {
      name: 'sector',
      type: 'select',
      label: 'Sector seleccionado',
      admin: { condition: (_, { tipo }) => tipo === 'sectores' || tipo === 'comodato' },
      options: [
        { label: 'Hoteles & Resorts', value: 'hoteles' },
        { label: 'Restaurantes', value: 'restaurantes' },
        { label: 'Empresarial y Corporativos', value: 'corporativos' },
        { label: 'Salud', value: 'salud' },
        { label: 'Comercial', value: 'comercial' },
        { label: 'Hogar', value: 'hogar' },
      ],
    },
    {
      name: 'colaboradores',
      type: 'select',
      label: 'Número de colaboradores',
      admin: { condition: (_, { tipo }) => tipo === 'sectores' },
      options: [
        { label: 'Menos de 100', value: 'menos_100' },
        { label: '100 a 500', value: '100_500' },
        { label: 'Más de 500', value: 'mas_500' },
      ],
    },
    {
      name: 'interaccion',
      type: 'select',
      label: 'Nivel de interacción / comedor',
      admin: { condition: (_, { tipo }) => tipo === 'sectores' },
      options: [
        { label: 'Sí, interacción constante', value: 'alta' },
        { label: 'Interacción moderada', value: 'moderada' },
        { label: 'No, solo baños', value: 'baja' },
      ],
    },
    {
      name: 'experienciaB2B',
      type: 'select',
      label: 'Experiencia en ventas B2B',
      admin: { condition: (_, { tipo }) => tipo === 'distribuidor' },
      options: [
        { label: 'Sí, cartera y experiencia en el sector', value: 'sector' },
        { label: 'Experiencia en otros sectores', value: 'otros_sectores' },
        { label: 'Busco diversificar inversiones', value: 'diversificar' },
      ],
    },
    {
      name: 'penetracionMercado',
      type: 'select',
      label: 'Capacidad de penetración en mercado local',
      admin: { condition: (_, { tipo }) => tipo === 'distribuidor' },
      options: [
        { label: 'Alta (contacto directo con plantas/corporativos/hoteles)', value: 'alta' },
        { label: 'Moderada (equipo de ventas listo)', value: 'moderada' },
      ],
    },
    { name: 'notas', type: 'textarea', label: 'Notas / mensaje' },
    { name: 'procesado', type: 'checkbox', defaultValue: false, label: 'Procesado por el equipo de ventas' },
  ],
  access: {
    read: ({ req }) => req.user?.rol === 'admin',
    create: () => true,
    update: ({ req }) => req.user?.rol === 'admin',
    delete: ({ req }) => req.user?.rol === 'admin',
  },
}
