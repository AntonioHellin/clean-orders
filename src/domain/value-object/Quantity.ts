import { Result, ok, fail } from '../../shared/Result.js';
import { DomainError } from '../errors/DomainError.js';

export class Quantity {
    private constructor(public readonly value: number) { }

    public static create(value: number): Result<Quantity, DomainError> {
        if (!Number.isInteger(value)) {
            return fail(new DomainError('Quantity must be an integer'));
        }
        if (value <= 0) {
            return fail(new DomainError('Quantity must be greater than zero'));
        }
        return ok(new Quantity(value));
    }
}
