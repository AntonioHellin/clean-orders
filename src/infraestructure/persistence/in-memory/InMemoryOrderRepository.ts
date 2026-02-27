import { OrderRepository } from '../../../application/ports/OrderRepository.js';
import { Order } from '../../../domain/entities/Order.js';
import { Result, ok, fail } from '../../../shared/Result.js';
import { InfraError, createInfraError } from '../../../application/errors.js';

export class InMemoryOrderRepository implements OrderRepository {
    private readonly orders: Map<string, Order> = new Map();

    public async save(order: Order): Promise<Result<void, InfraError>> {
        try {
            this.orders.set(order.id.value, order);
            return ok(undefined);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return fail(createInfraError('Failed to save order in memory', errorMessage));
        }
    }

    public async findById(id: string): Promise<Result<Order | null, InfraError>> {
        try {
            const order = this.orders.get(id) || null;
            return ok(order);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return fail(createInfraError(`Failed to find order with id ${id} in memory`, errorMessage));
        }
    }
}
