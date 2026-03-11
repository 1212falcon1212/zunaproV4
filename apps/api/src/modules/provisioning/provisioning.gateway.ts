import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: [/\.zunapro\.com$/, 'http://localhost:3000'],
  },
})
export class ProvisioningGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ProvisioningGateway.name);

  @SubscribeMessage('subscribe_provisioning')
  handleSubscribe(client: Socket, tenantId: string) {
    this.logger.log(`Client ${client.id} subscribed to provisioning for tenant ${tenantId}`);
    client.join(`provisioning:${tenantId}`);
    return { event: 'subscribed', data: { tenantId } };
  }

  emitProgress(tenantId: string, progress: { jobName: string; status: string; step: number; totalSteps: number; message: string }) {
    this.server.to(`provisioning:${tenantId}`).emit('provisioning_progress', progress);
  }
}
