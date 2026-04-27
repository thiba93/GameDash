import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import type {
  MatchHistoryItem,
  PlayerProfileResponse,
  PlayerMmrResponse
} from "@gamedash/contracts";
import type { UpdatePlayerProfileRequest } from "@gamedash/contracts";
import { AuthGuard } from "../auth/auth.guard";
import { AuthService } from "../auth/auth.service";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthenticatedUser } from "../auth/auth.types";

@Controller("players")
@UseGuards(AuthGuard)
export class PlayersController {
  constructor(private readonly authService: AuthService) {}

  @Get("me/profile")
  getMyProfile(@CurrentUser() user: AuthenticatedUser): PlayerProfileResponse {
    return this.authService.getProfile(user);
  }

  @Patch("me/profile")
  updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdatePlayerProfileRequest
  ): PlayerProfileResponse {
    return this.authService.updateProfile(user, body);
  }

  @Get(":playerId/mmr")
  getPlayerMmr(@Param("playerId") playerId: string): PlayerMmrResponse {
    return {
      playerId,
      ratings: [
        { mode: "ranked", mmr: 1000, rank: "BRONZE III" },
        { mode: "unranked", mmr: 1000, rank: "UNRANKED" }
      ]
    };
  }

  @Get(":playerId/matches")
  getPlayerMatches(@Param("playerId") playerId: string): MatchHistoryItem[] {
    return [
      {
        matchId: `${playerId}-latest-match`,
        mode: "ranked",
        createdAt: new Date().toISOString(),
        result: "win"
      }
    ];
  }
}
