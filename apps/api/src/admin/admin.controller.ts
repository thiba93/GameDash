import { Controller, Get, UseGuards } from "@nestjs/common";
import type { AdminDashboardSummary } from "@gamedash/contracts";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";

@Controller("admin")
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  @Get("dashboard")
  @Roles("staff", "admin")
  getDashboard(): AdminDashboardSummary {
    return {
      activePlayers: 1200,
      dailyMatches: 9800,
      virtualRevenue: 45200,
      mapActivity: 310
    };
  }
}
