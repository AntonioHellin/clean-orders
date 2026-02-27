import { Result, ok, fail } from '../../shared/Result.js';
import { DomainError } from '../errors/DomainError.js';

export class OrderId {
    private constructor(public readonly value: string) { }

    public static create(value: string): Result<OrderId, DomainError> {
        if (!value || value.trim().length === 0) {
            return fail(new DomainError('OrderId cannot be empty'));
        }
        return ok(new OrderId(value));
    }
}
