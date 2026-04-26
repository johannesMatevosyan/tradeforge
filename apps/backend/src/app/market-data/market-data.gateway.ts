import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MarketPrice } from '@tradeforge/shared-types';
import { Server } from 'socket.io';
import { OrdersExecutionService } from '../orders/orders-execution.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MarketDataGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  private prices: Record<string, number> = {
    BTCUSD: 68450,
    ETHUSD: 3520,
    XAUUSD: 2378,
  };

  constructor(private readonly ordersExecutionService: OrdersExecutionService) {}

  afterInit(): void {
    this.startPriceStream();
  }

  private startPriceStream(): void {
    setInterval(async () => {
      const updates: MarketPrice[] = Object.keys(this.prices).map((symbol) => {
        const current = this.prices[symbol];

        // simple random walk
        const change = (Math.random() - 0.5) * (current * 0.002);

        const newPrice = +(current + change).toFixed(2);

        this.prices[symbol] = newPrice;

        return {
          symbol,
          price: newPrice,
          timestamp: new Date().toISOString(),
        };
      });

      for (const update of updates) {
        await this.ordersExecutionService.executeLimitOrdersForPriceUpdate(
          update.symbol,
          update.price,
        );
      }

      this.server.emit('prices', updates);
    }, 1500);
  }
}
