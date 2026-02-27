import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Dependencies } from '../../../composition/container.js';
import { AppError } from '../../../application/errors.js';

interface CreateOrderBody {
    orderId: string;
    customerId: string;
}

interface AddItemParams {
    orderId: string;
}

interface AddItemBody {
    sku: string;
    quantity: number;
}

export class OrdersController {
    private readonly createOrder: Dependencies['createOrder'];
    private readonly addItemToOrder: Dependencies['addItemToOrder'];

    constructor(deps: Dependencies) {
        // Extract the fully instantiated use cases from the container
        this.createOrder = deps.createOrder;
        this.addItemToOrder = deps.addItemToOrder;
    }

    public registerRoutes(fastify: FastifyInstance): void {
        fastify.post<{ Body: CreateOrderBody }>('/orders', this.handleCreateOrder.bind(this));
        fastify.post<{ Params: AddItemParams; Body: AddItemBody }>('/orders/:orderId/items', this.handleAddOrderItem.bind(this));
    }

    private async handleCreateOrder(
        request: FastifyRequest<{ Body: CreateOrderBody }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const { orderId, customerId } = request.body;

        const result = await this.createOrder.execute({ orderId, customerId });

        if (result.isFailure) {
            return this.mapAppErrorToResponse(result.error, reply);
        }

        return reply.status(201).send({ message: 'Order created successfully', orderId });
    }

    private async handleAddOrderItem(
        request: FastifyRequest<{ Params: AddItemParams; Body: AddItemBody }>,
        reply: FastifyReply
    ): Promise<FastifyReply> {
        const { orderId } = request.params;
        const { sku, quantity } = request.body;

        const result = await this.addItemToOrder.execute({ orderId, sku, quantity });

        if (result.isFailure) {
            return this.mapAppErrorToResponse(result.error, reply);
        }

        return reply.status(200).send({ message: 'Item added to order successfully' });
    }

    private mapAppErrorToResponse(error: AppError, reply: FastifyReply): FastifyReply {
        switch (error.type) {
            case 'VALIDATION_ERROR':
            case 'DOMAIN_ERROR':
                // Invalid input or domain invariant violation matches HTTP 400 Bad Request
                return reply.status(400).send({ error: error.message, details: error.details });
            case 'NOT_FOUND_ERROR':
                // Item or Order not found matches HTTP 404
                return reply.status(404).send({ error: error.message, details: error.details });
            case 'CONFLICT_ERROR':
                // State conflict matches HTTP 409
                return reply.status(409).send({ error: error.message, details: error.details });
            case 'INFRA_ERROR':
            default:
                // Unexpected infrastructure errors match HTTP 500
                return reply.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
