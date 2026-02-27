import { Result, ok, fail } from '../../shared/Result.js';
import { AppError, createDomainError, createInfraError } from '../errors.js';
import { CreateOrderDTO } from '../dto/CreateOrderDTO.js';
import { ServerDependencies } from '../ports/ServerDependencies.js';
import { Order } from '../../domain/entities/Order.js';
import { OrderId } from '../../domain/value-object/OrderId.js';

export class CreateOrder {
    constructor(private readonly deps: ServerDependencies) { }

    public async execute(dto: CreateOrderDTO): Promise<Result<void, AppError>> {
        // 1. Convert primitive DTO properties to Value Objects
        const orderIdOrError = OrderId.create(dto.orderId);

        if (orderIdOrError.isFailure) {
            return fail(createDomainError(orderIdOrError.error.message));
        }

        // 2. Create the Entity (Aggregate Root)
        const orderOrError = Order.create(orderIdOrError.value, dto.customerId);

        if (orderOrError.isFailure) {
            return fail(createDomainError(orderOrError.error.message));
        }

        const order = orderOrError.value;

        // 3. Persist the Aggregate
        const saveResult = await this.deps.orderRepository.save(order);
        if (saveResult.isFailure) {
            return fail(createInfraError('Failed to save order to repository', saveResult.error.message));
        }

        // 4. Publish Domain Events
        const publishResult = await this.deps.eventBus.publish(order.domainEvents);
        if (publishResult.isFailure) {
            // Depending on consistency requirements, we might not fail the use case here,
            // or use outbox pattern. For this example, we map it to an application error.
            return fail(createInfraError('Failed to publish order domain events', publishResult.error.message));
        }

        order.clearEvents();

        // 5. Return success result
        return ok(undefined);
    }
}
