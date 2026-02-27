import { DomainEvent } from './DomainEvent.js';

export class ItemAddedToOrder implements DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventName = 'ItemAddedToOrder';

    constructor(
        public readonly orderId: string,
        public readonly sku: string,
        public readonly quantity: number
    ) {
        this.occurredOn = new Date();
    }
}
