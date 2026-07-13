// Límite de dispensadores por pedido para usuarios individuales/invitados (no empresa/distribuidor).
// Única fuente de verdad — cualquier validación (server action, UI de carrito) debe importar esto,
// no repetir "2". Vive fuera de src/collections/Orders.ts para poder importarse desde componentes
// de cliente sin arrastrar dependencias de Payload al bundle del navegador.
export const MAX_DISPENSADORES_INDIVIDUAL = 2
