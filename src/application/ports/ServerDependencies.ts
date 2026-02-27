import { OrderRepository } from './OrderRepository.js';
import { PricingService } from './PricingService.js';
import { EventBus } from './EventBus.js';
import { Clock } from './Clock.js';

export interface ServerDependencies {
    orderRepository: OrderRepository;
    pricingService: PricingService;
    eventBus: EventBus;
    clock: Clock;
}
