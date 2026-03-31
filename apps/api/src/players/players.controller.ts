import { Controller, Get, Param } from "@nestjs/common";
import type {
  MatchHistoryItem,
  PlayerMmrResponse
} from "@gamedash/contracts";

@Controller("players")
export class PlayersController {
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
