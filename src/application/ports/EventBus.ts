import { DomainEvent } from '../../domain/events/DomainEvent.js';
import { Result } from '../../shared/Result.js';
import { InfraError } from '../errors.js';

export interface EventBus {
    publish(events: ReadonlyArray<DomainEvent>): Promise<Result<void, InfraError>>;
}
