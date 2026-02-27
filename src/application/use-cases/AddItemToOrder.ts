import { Result, ok, fail } from '../../shared/Result.js';
import { AppError, createDomainError, createNotFoundError, createInfraError } from '../errors.js';
import { AddItemToOrderDTO } from '../dto/AddItemToOrderDTO.js';
import { ServerDependencies } from '../ports/ServerDependencies.js';
import { SKU } from '../../domain/value-object/SKU.js';
import { Quantity } from '../../domain/value-object/Quantity.js';
import { OrderItem } from '../../domain/value-object/OrderItem.js';

export class AddItemToOrder {
    constructor(private readonly deps: ServerDependencies) { }

    public async execute(dto: AddItemToOrderDTO): Promise<Result<void, AppError>> {
        // 1. Fetch the Aggregate Root
        const orderResult = await this.deps.orderRepository.findById(dto.orderId);
        if (orderResult.isFailure) {
            return fail(createInfraError('Error accessing database', orderResult.error.message));
        }

        const order = orderResult.value;
        if (!order) {
            return fail(createNotFoundError(`Order with ID ${dto.orderId} not found`));
        }

        // 2. Validate inputted Command properties to Domain Value Objects
        const skuOrError = SKU.create(dto.sku);
        if (skuOrError.isFailure) {
            return fail(createDomainError(skuOrError.error.message));
        }
        const sku = skuOrError.value;

        const quantityOrError = Quantity.create(dto.quantity);
        if (quantityOrError.isFailure) {
            return fail(createDomainError(quantityOrError.error.message));
        }
        const quantity = quantityOrError.value;

        // 3. Connect with other services to get rules/values (Pricing Service in this case)
        const priceResult = await this.deps.pricingService.getPriceForSKU(sku);
        if (priceResult.isFailure) {
            if (priceResult.error.type === 'NOT_FOUND_ERROR') {
                return fail(createNotFoundError(priceResult.error.message));
            }
            return fail(createInfraError('Error getting price for SKU', priceResult.error.message));
        }
        const unitPrice = priceResult.value;

        // 4. Create internal Entity/VO for the aggregate
        const orderItemOrError = OrderItem.create(sku, quantity, unitPrice);
        if (orderItemOrError.isFailure) {
            return fail(createDomainError(orderItemOrError.error.message));
        }

        // 5. Execute Business Logic in Aggregate
        const addResult = order.addItem(orderItemOrError.value);
        if (addResult.isFailure) {
            return fail(createDomainError(addResult.error.message));
        }

        // 6. Save modified Aggregate
        const saveResult = await this.deps.orderRepository.save(order);
        if (saveResult.isFailure) {
            return fail(createInfraError('Error saving updated order', saveResult.error.message));
        }

        // 7. Dispatch events related to the aggregate mutation
        const publishResult = await this.deps.eventBus.publish(order.domainEvents);
        if (publishResult.isFailure) {
            return fail(createInfraError('Error publishing events', publishResult.error.message));
        }

        order.clearEvents();

        // 8. Return success
        return ok(undefined);
    }
}
