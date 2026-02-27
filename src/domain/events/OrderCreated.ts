import { DomainEvent } from './DomainEvent.js';

export class OrderCreated implements DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventName = 'OrderCreated';

    constructor(
        public readonly orderId: string,
        public readonly customerId: string
    ) {
        this.occurredOn = new Date();
    }
}
