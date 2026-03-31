import { Body, Controller, Param, Post } from "@nestjs/common";
import type {
  MatchResultRequest,
  MatchResultResponse
} from "@gamedash/contracts";

@Controller("matches")
export class MatchesController {
  @Post(":matchId/result")
  submitResult(
    @Param("matchId") matchId: string,
    @Body() body: MatchResultRequest
  ): MatchResultResponse {
    return {
      accepted: Boolean(matchId && body.winnerPlayerId),
      mmrUpdated: true
    };
  }
}
