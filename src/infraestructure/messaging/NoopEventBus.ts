import { EventBus } from '../../application/ports/EventBus.js';
import { DomainEvent } from '../../domain/events/DomainEvent.js';
import { Result, ok } from '../../shared/Result.js';
import { InfraError } from '../../application/errors.js';

export class NoopEventBus implements EventBus {
    public async publish(events: ReadonlyArray<DomainEvent>): Promise<Result<void, InfraError>> {
        // In a real implementation this would publish to an event broker like RabbitMQ, Kafka, SNS/SQS, etc.
        // For this No-Op implementation, we simply log the events for visibility and return success

        if (events.length > 0) {
            console.log(`[NoopEventBus] Simulating publishing ${events.length} domain events:`);
            events.forEach(event => {
                console.log(`    - ${event.eventName} occurred on ${event.occurredOn.toISOString()}`);
            });
        }

        return ok(undefined);
    }
}
