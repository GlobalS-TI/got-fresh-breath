import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'email', 'tipo', 'sector', 'createdAt'],
    group: 'CRM',
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
