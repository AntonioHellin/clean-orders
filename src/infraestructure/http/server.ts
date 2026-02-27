import fastify, { FastifyInstance } from 'fastify';
import { OrdersController } from './controllers/OrdersController.js';
import { Dependencies } from '../../composition/container.js';

export class AppServer {
    private readonly app: FastifyInstance;
    private readonly port: number;

    constructor(private readonly deps: Dependencies, port: number = 3000) {
        this.app = fastify({ logger: true });
        this.port = port;
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const ordersController = new OrdersController(this.deps);

        // Register the controller's routes and optionally prefix them
        this.app.register((instance, opts, done) => {
            ordersController.registerRoutes(instance);
            done();
        }, { prefix: '/api/v1' });

        // Health check endpoint
        this.app.get('/health', async (request, reply) => {
            return reply.status(200).send({ status: 'OK' });
        });
    }

    public async start(): Promise<void> {
        try {
            await this.app.listen({ port: this.port, host: '0.0.0.0' });
            console.log(`Server listening on port ${this.port}`);
        } catch (err) {
            this.app.log.error(err);
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        await this.app.close();
    }
}
