import { Result, ok, fail } from '../../shared/Result.js';
import { DomainError } from '../errors/DomainError.js';
import { Currency } from './Currency.js';

export class Money {
    private constructor(
        public readonly amount: number,
        public readonly currency: Currency
    ) { }

    public static create(amount: number, currency: Currency): Result<Money, DomainError> {
        if (amount < 0) {
            return fail(new DomainError('Amount cannot be negative'));
        }
        // Round to 2 decimal places to avoid floating point issues
        const roundedAmount = Math.round(amount * 100) / 100;
        return ok(new Money(roundedAmount, currency));
    }

    public add(other: Money): Result<Money, DomainError> {
        if (!this.currency.equals(other.currency)) {
            return fail(new DomainError('Cannot add money of different currencies'));
        }
        return Money.create(this.amount + other.amount, this.currency);
    }

    public multiply(multiplier: number): Result<Money, DomainError> {
        if (multiplier < 0) {
            return fail(new DomainError('Multiplier cannot be negative'));
        }
        return Money.create(this.amount * multiplier, this.currency);
    }
}
