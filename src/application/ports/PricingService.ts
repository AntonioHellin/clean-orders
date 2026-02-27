import { Money } from '../../domain/value-object/Money.js';
import { SKU } from '../../domain/value-object/SKU.js';
import { Result } from '../../shared/Result.js';
import { InfraError, NotFoundError } from '../errors.js';

export interface PricingService {
    getPriceForSKU(sku: SKU): Promise<Result<Money, InfraError | NotFoundError>>;
}
