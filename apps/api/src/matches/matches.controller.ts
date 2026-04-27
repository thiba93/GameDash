import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import type {
  MatchResultRequest,
  MatchResultResponse
} from "@gamedash/contracts";
import { AuthGuard } from "../auth/auth.guard";

@Controller("matches")
@UseGuards(AuthGuard)
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
