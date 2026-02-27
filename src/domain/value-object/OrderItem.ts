import { Result, ok, fail } from '../../shared/Result.js';
import { DomainError } from '../errors/DomainError.js';
import { Money } from './Money.js';
import { Quantity } from './Quantity.js';
import { SKU } from './SKU.js';

export class OrderItem {
    private constructor(
        public readonly sku: SKU,
        public readonly quantity: Quantity,
        public readonly unitPrice: Money
    ) { }

    public static create(
        sku: SKU,
        quantity: Quantity,
        unitPrice: Money
    ): Result<OrderItem, DomainError> {
        return ok(new OrderItem(sku, quantity, unitPrice));
    }

    public getTotal(): Money {
        const result = this.unitPrice.multiply(this.quantity.value);
        if (result.isFailure) {
            // Should not happen as multiplier >= 1 is guaranteed by Quantity
            throw new Error('Unexpected error calculating OrderItem total');
        }
        return result.value;
    }
}
