import { Result, ok, fail } from '../../shared/Result.js';
import { DomainError } from '../errors/DomainError.js';

export class SKU {
    private constructor(public readonly value: string) { }

    public static create(value: string): Result<SKU, DomainError> {
        if (!value || value.trim().length === 0) {
            return fail(new DomainError('SKU cannot be empty'));
        }
        // Additional SKU validations can be added here
        return ok(new SKU(value));
    }
}
