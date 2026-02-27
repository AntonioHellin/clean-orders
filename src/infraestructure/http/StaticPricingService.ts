import { PricingService } from '../../application/ports/PricingService.js';
import { SKU } from '../../domain/value-object/SKU.js';
import { Money } from '../../domain/value-object/Money.js';
import { Currency } from '../../domain/value-object/Currency.js';
import { Result, ok, fail } from '../../shared/Result.js';
import { InfraError, NotFoundError, createNotFoundError, createInfraError } from '../../application/errors.js';

export class StaticPricingService implements PricingService {
    // Simulated external database or service response
    private readonly catalog: Record<string, { amount: number; currency: string }> = {
        'LAPTOP': { amount: 999.99, currency: 'USD' },
        'MOUSE': { amount: 25.50, currency: 'USD' },
        'KEYBOARD': { amount: 45.00, currency: 'USD' },
        'MONITOR': { amount: 299.00, currency: 'EUR' }
    };

    public async getPriceForSKU(sku: SKU): Promise<Result<Money, InfraError | NotFoundError>> {
        try {
            const product = this.catalog[sku.value];

            if (!product) {
                return fail(createNotFoundError(`Price for SKU ${sku.value} not found in static catalog`));
            }

            const currencyResult = Currency.create(product.currency);
            if (currencyResult.isFailure) {
                return fail(createInfraError(`Invalid currency ${product.currency} configured for SKU ${sku.value}`));
            }

            const moneyResult = Money.create(product.amount, currencyResult.value);
            if (moneyResult.isFailure) {
                return fail(createInfraError(`Invalid amount ${product.amount} configured for SKU ${sku.value}`));
            }

            return ok(moneyResult.value);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error in StaticPricingService';
            return fail(createInfraError('Failed to fetch price from static catalog', errorMessage));
        }
    }
}
