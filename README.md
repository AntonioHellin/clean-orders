# Clean Architecture Orders API 📦

Una implementación de Clean Architecture pura (Hexagonal) utilizando TypeScript. Este proyecto demuestra cómo separar la lógica de negocio, las reglas de aplicación y las preocupaciones de infraestructura para un dominio de "Pedidos" (Orders).

## 🏗️ Arquitectura

El proyecto sigue un diseño de Hexagonal Architecture estricto sin usar frameworks en las capas internas, garantizando que el Core del sistema sea comprobable y agnóstico a la tecnología elegida.

```text
/src
  ├── /domain         # (Core) Value Objects, Entities, Domain Events y Domain Errors puros.
  ├── /application    # (Use Cases) Casos de uso de la aplicación, DTOs y Puertos (Interfaces).
  ├── /infrastructure # (Adapters) Controladores HTTP (Fastify), Repositorios y Servicios reales.
  └── /composition    # (Composition Root) Único lugar donde se inyectan dependencias.
```

## 🚀 Tecnologías

*   **Lenguaje:** TypeScript (ESM)
*   **Servidor HTTP:** Fastify
*   **Dominio:** Patrones Tácticos de DDD (Aggregate Routes, Value Objects, Domain Events)
*   **Manejo de Errores:** Tipos discriminados funcionales `Result<T, E>` en lugar de `throw new Error()`.

## ⚙️ Cómo ejecutar

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Arrancar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

El servidor web arrancará en el puerto `3000` (o el indicado por la variable de entorno `PORT`).

## 🧪 Ejemplos de uso (API)

**Crear un Pedido**
```powershell
curl.exe -X POST http://localhost:3000/api/v1/orders -H "Content-Type: application/json" -d "{\"orderId\": \"ORDER-123\", \"customerId\": \"CUST-456\"}"
```

**Añadir un Item a un Pedido**
*(Asegúrate de que el orderId es el mismo que creaste en el paso anterior)*
```powershell
curl.exe -X POST http://localhost:3000/api/v1/orders/ORDER-123/items -H "Content-Type: application/json" -d "{\"sku\": \"LAPTOP\", \"quantity\": 2}"
```