import { Order } from '../../domain/entities/Order.js';
import { Result } from '../../shared/Result.js';
import { InfraError } from '../errors.js';

export interface OrderRepository {
    save(order: Order): Promise<Result<void, InfraError>>;
    findById(id: string): Promise<Result<Order | null, InfraError>>;
}
