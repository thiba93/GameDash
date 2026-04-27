import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import type { QueueJoinRequest, QueueStatusResponse } from "@gamedash/contracts";
import { AuthGuard } from "../auth/auth.guard";

@Controller("matchmaking/queue")
@UseGuards(AuthGuard)
export class MatchmakingController {
  @Post("join")
  joinQueue(@Body() body: QueueJoinRequest): QueueStatusResponse {
    return {
      state: "in_queue",
      mode: body.mode,
      estimatedWaitSeconds: 30
    };
  }

  @Post("leave")
  leaveQueue(): QueueStatusResponse {
    return {
      state: "online"
    };
  }

  @Get("status")
  queueStatus(): QueueStatusResponse {
    return {
      state: "online"
    };
  }
}
