import type { CollectionConfig, CollectionBeforeChangeHook, Validate } from 'payload'

import { REGIMENES_FISCALES, USOS_CFDI } from '@/lib/datos-fiscales'

// Roles que un usuario puede auto-asignarse al registrarse. 'distribuidor' se otorga
// manualmente por un admin tras pasar por el flujo de leads (formulario Distribuidor);
// 'admin' nunca es auto-asignable.
const SELF_SERVICE_ROLES = ['individual', 'empresa']

// Evita escalación de privilegios: un usuario no-admin no puede asignarse un rol
// fuera de SELF_SERVICE_ROLES al crear su cuenta, ni cambiar su rol después al
// editar su propio perfil.
const enforceDefaultRol: CollectionBeforeChangeHook = async ({ data, operation, req, originalDoc }) => {
  const isAdmin = req.user?.rol === 'admin'
  if (isAdmin) return data

  // Válvula de arranque: si todavía no existe ningún admin en el sistema no hay
  // privilegio que escalar, así que se permite fijar el rol libremente (crear o
  // promover una cuenta existente). En cuanto exista un admin, este bypass se cierra.
  const { totalDocs: adminCount } = await req.payload.count({
    collection: 'users',
    where: { rol: { equals: 'admin' } },
  })
  if (adminCount === 0) return data

  if (operation === 'create') {
    data.rol = SELF_SERVICE_ROLES.includes(data.rol) ? data.rol : 'individual'
  } else if (operation === 'update' && originalDoc) {
    data.rol = originalDoc.rol
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['nombre', 'apellido', 'email', 'telefono', 'rol', 'empresa'],
    group: 'CRM',
  },
  auth: true,
  hooks: {
    beforeChange: [enforceDefaultRol],
  },
  fields: [
    { name: 'nombre', type: 'text', required: true },
    { name: 'apellido', type: 'text', required: true },
    {
      // Obligatorio en el registro (ver registerAction), pero no en el schema: las cuentas
      // creadas antes de este campo no lo tienen y no deben quedar inválidas al editarlas.
      name: 'telefono',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'rol',
      type: 'select',
      required: true,
      defaultValue: 'individual',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Empresa', value: 'empresa' },
        { label: 'Distribuidor', value: 'distribuidor' },
        { label: 'Individual', value: 'individual' },
      ],
    },
    {
      name: 'empresa',
      type: 'text',
      label: 'Nombre de empresa',
      admin: { condition: (_, { rol }) => rol === 'empresa' || rol === 'distribuidor' },
      validate: ((value, { siblingData }) => {
        const rol = (siblingData as { rol?: string })?.rol
        if ((rol === 'empresa' || rol === 'distribuidor') && !value) {
          return 'El nombre de empresa es requerido para este rol.'
        }
        return true
      }) as Validate<string | null | undefined>,
    },
    {
      // Opcionales — solo los llenan los clientes que requieren factura. La validación de
      // "todos o ninguno" y del formato de RFC vive en parseDatosFiscales (src/lib/datos-fiscales.ts).
      name: 'datosFiscales',
      type: 'group',
      label: 'Datos fiscales',
      fields: [
        { name: 'rfc', type: 'text', label: 'RFC' },
        { name: 'razonSocial', type: 'text', label: 'Razón social' },
        { name: 'regimenFiscal', type: 'select', label: 'Régimen fiscal', options: REGIMENES_FISCALES },
        { name: 'usoCfdi', type: 'select', label: 'Uso de CFDI', options: USOS_CFDI },
        { name: 'cpFiscal', type: 'text', label: 'Código postal fiscal' },
      ],
    },
  ],
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.rol === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    create: () => true,
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.rol === 'admin') return true
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.rol === 'admin',
  },
}
