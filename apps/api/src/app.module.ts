import { Module } from "@nestjs/common";
import { AdminController } from "./admin/admin.controller";
import { AuthController } from "./auth/auth.controller";
import { EconomyController } from "./economy/economy.controller";
import { HealthController } from "./health/health.controller";
import { MapsController } from "./maps/maps.controller";
import { MatchmakingController } from "./matchmaking/matchmaking.controller";
import { MatchesController } from "./matches/matches.controller";
import { PlayersController } from "./players/players.controller";
import {
  AdminMonitoringGateway,
  MatchmakingGateway,
  PlayerStatusGateway
} from "./realtime/realtime.gateway";

@Module({
  imports: [],
  controllers: [
    HealthController,
    AuthController,
    PlayersController,
    MatchmakingController,
    MatchesController,
    EconomyController,
    MapsController,
    AdminController
  ],
  providers: [MatchmakingGateway, PlayerStatusGateway, AdminMonitoringGateway]
})
export class AppModule {}
