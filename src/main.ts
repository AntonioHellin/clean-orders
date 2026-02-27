import { buildContainer } from './composition/container.js';
import { AppServer } from './infraestructure/http/server.js';

async function bootstrap() {
    try {
        console.log('🔄 Building dependency container...');

        // 1. Build the Application Container
        const container = buildContainer();

        console.log('✅ Container built successfully. Injected Dependencies:');
        console.log(`  - 📦 OrderRepository: ${container.orderRepository.constructor.name}`);
        console.log(`  - 💵 PricingService: ${container.pricingService.constructor.name}`);
        console.log(`  - 📡 EventBus: ${container.eventBus.constructor.name}`);
        console.log(`  - ⏱️  Clock: ${container.clock.constructor.name}`);

        // 2. Initialize the Server with the injected dependencies
        const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
        const server = new AppServer(container, PORT);

        // 3. Start listening
        await server.start();

        // 4. Graceful shutdown handler
        const signals = ['SIGINT', 'SIGTERM'] as const;
        for (const signal of signals) {
            process.on(signal, async () => {
                console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
                await server.stop();
                process.exit(0);
            });
        }
    } catch (err) {
        console.error('❌ Error starting application:', err);
        process.exit(1);
    }
}

bootstrap();
