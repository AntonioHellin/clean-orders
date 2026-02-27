import { Result, ok, fail } from '../../shared/Result.js';
import { DomainError } from '../errors/DomainError.js';

export type SupportedCurrencies = 'USD' | 'EUR' | 'GBP';

export class Currency {
    private constructor(public readonly value: SupportedCurrencies) { }

    public static create(value: string): Result<Currency, DomainError> {
        const uppercaseValue = value.toUpperCase();
        if (uppercaseValue !== 'USD' && uppercaseValue !== 'EUR' && uppercaseValue !== 'GBP') {
            return fail(new DomainError(`Unsupported currency: ${value}`));
        }
        return ok(new Currency(uppercaseValue as SupportedCurrencies));
    }

    public equals(other: Currency): boolean {
        return this.value === other.value;
    }
}
