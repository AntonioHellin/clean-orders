# Microsevicio de pedidos
- **Dominio**: Order, Price, SKU, Quantity, eventos de dominio.
- **Application**: casos de uso CreateOrder, AddItemToOrder, puertos y DTOs.
- **Infra**: repositorio InMemory, pricing estatico, event bus no-op.
- **HTTP**: endpoints minimos con Fastify.
- **Composition**: container.ts como composition root.
- **Tests**: dominio + aceptacion de casos de uso.

## Comportamiento
- POST /orders: crea un pedido
- POST /orders/:ordreId/items: agrega una linea (SKU + qty) con precio actual
- Devuelve el total del pedido