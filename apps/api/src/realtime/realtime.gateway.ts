import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";

@WebSocketGateway({ namespace: "matchmaking", cors: true })
export class MatchmakingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit("queue.status.updated", {
      state: "online",
      updatedAt: new Date().toISOString()
    });
  }

  handleDisconnect() {
    return;
  }
}

@WebSocketGateway({ namespace: "player-status", cors: true })
export class PlayerStatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit("player.online", {
      status: "ONLINE",
      updatedAt: new Date().toISOString()
    });
  }

  handleDisconnect() {
    return;
  }
}

@WebSocketGateway({ namespace: "admin-monitoring", cors: true })
export class AdminMonitoringGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit("kpi.players.active.updated", {
      metric: "kpi.players.active",
      value: 1200,
      updatedAt: new Date().toISOString()
    });
  }

  handleDisconnect() {
    return;
  }
}
