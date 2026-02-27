import { ServerDependencies } from '../application/ports/ServerDependencies.js';
import { InMemoryOrderRepository } from '../infraestructure/persistence/in-memory/InMemoryOrderRepository.js';
import { StaticPricingService } from '../infraestructure/http/StaticPricingService.js';
import { NoopEventBus } from '../infraestructure/messaging/NoopEventBus.js';
import { SystemClock } from '../infraestructure/clock/SystemClock.js';
import { CreateOrder } from '../application/use-cases/CreateOrder.js';
import { AddItemToOrder } from '../application/use-cases/AddItemToOrder.js';

export interface Dependencies extends ServerDependencies {
    createOrder: CreateOrder;
    addItemToOrder: AddItemToOrder;
}

export function buildContainer(): Dependencies {
    // 1. Instantiate the Infrastructure adapters (Ports)
    const orderRepository = new InMemoryOrderRepository();
    const pricingService = new StaticPricingService();
    const eventBus = new NoopEventBus();
    const clock = new SystemClock();

    const serverDependencies: ServerDependencies = {
        orderRepository,
        pricingService,
        eventBus,
        clock
    };

    // 2. Instantiate Application Use Cases with their dependencies
    const createOrder = new CreateOrder(serverDependencies);
    const addItemToOrder = new AddItemToOrder(serverDependencies);

    // 3. Return the fully resolved dependency container
    return {
        ...serverDependencies,
        createOrder,
        addItemToOrder
    };
}
