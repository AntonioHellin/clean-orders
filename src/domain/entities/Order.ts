import { Result, ok, fail } from '../../shared/Result.js';
import { DomainError } from '../errors/DomainError.js';
import { OrderId } from '../value-object/OrderId.js';
import { OrderItem } from '../value-object/OrderItem.js';
import { DomainEvent } from '../events/DomainEvent.js';
import { OrderCreated } from '../events/OrderCreated.js';
import { ItemAddedToOrder } from '../events/ItemAddedToOrder.js';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED';

export class Order {
    private _domainEvents: DomainEvent[] = [];
    private _items: OrderItem[] = [];

    private constructor(
        public readonly id: OrderId,
        public readonly customerId: string,
        private _status: OrderStatus
    ) { }

    public static create(id: OrderId, customerId: string): Result<Order, DomainError> {
        if (!customerId || customerId.trim() === '') {
            return fail(new DomainError('Customer ID cannot be empty'));
        }

        const order = new Order(id, customerId, 'PENDING');
        order.addDomainEvent(new OrderCreated(id.value, customerId));

        return ok(order);
    }

    public get items(): ReadonlyArray<OrderItem> {
        return [...this._items];
    }

    public get status(): string {
        return this._status;
    }

    public get domainEvents(): ReadonlyArray<DomainEvent> {
        return [...this._domainEvents];
    }

    public addItem(item: OrderItem): Result<void, DomainError> {
        if (this._status !== 'PENDING') {
            return fail(new DomainError('Cannot add items to an order that is not PENDING'));
        }

        this._items.push(item);
        this.addDomainEvent(new ItemAddedToOrder(
            this.id.value,
            item.sku.value,
            item.quantity.value
        ));

        return ok(undefined);
    }

    public getTotalsPerCoin(): Map<string, number> {
        const totals = new Map<string, number>();

        for (const item of this._items) {
            const currencyVal = item.unitPrice.currency.value;
            const itemTotal = item.getTotal().amount;

            const currentTotal = totals.get(currencyVal) || 0;
            totals.set(currencyVal, currentTotal + itemTotal);
        }

        return totals;
    }

    public clearEvents(): void {
        this._domainEvents = [];
    }

    private addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);
    }
}
