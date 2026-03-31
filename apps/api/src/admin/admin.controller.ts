import { Controller, Get } from "@nestjs/common";
import type { AdminDashboardSummary } from "@gamedash/contracts";

@Controller("admin")
export class AdminController {
  @Get("dashboard")
  getDashboard(): AdminDashboardSummary {
    return {
      activePlayers: 1200,
      dailyMatches: 9800,
      virtualRevenue: 45200,
      mapActivity: 310
    };
  }
}
