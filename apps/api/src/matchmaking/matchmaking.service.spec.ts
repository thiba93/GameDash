import assert from "node:assert/strict";
import { BadRequestException } from "@nestjs/common";
import { MatchmakingService } from "./matchmaking.service";
import type { AuthenticatedUser } from "../auth/auth.types";

const service = new MatchmakingService();

const playerOne: AuthenticatedUser = {
  id: "usr_player_one",
  email: "one@example.test",
  role: "player"
};

const playerTwo: AuthenticatedUser = {
  id: "usr_player_two",
  email: "two@example.test",
  role: "player"
};

const queued = service.joinQueue(playerOne, { mode: "ranked" });
assert.equal(queued.state, "in_queue");
assert.equal(queued.mode, "ranked");
assert.equal(queued.playerId, playerOne.id);

const matched = service.joinQueue(playerTwo, { mode: "ranked" });
assert.equal(matched.state, "in_match");
assert.ok(matched.matchId);
assert.equal(matched.opponentPlayerId, playerOne.id);

const playerOneStatus = service.getQueueStatus(playerOne);
assert.equal(playerOneStatus.state, "in_match");
assert.equal(playerOneStatus.matchId, matched.matchId);

assert.throws(
  () =>
    service.submitResult(playerOne, matched.matchId ?? "missing", {
      winnerPlayerId: "usr_not_in_match"
    }),
  BadRequestException
);

const result = service.submitResult(playerOne, matched.matchId ?? "missing", {
  winnerPlayerId: playerOne.id,
  notes: "Phase 2 smoke result"
});
assert.equal(result.accepted, true);
assert.equal(result.mmrUpdated, true);
assert.equal(result.participants.length, 2);

const winnerMmr = service.getPlayerMmr(playerOne.id).ratings.find((rating) => rating.mode === "ranked");
const loserMmr = service.getPlayerMmr(playerTwo.id).ratings.find((rating) => rating.mode === "ranked");
assert.equal(winnerMmr?.mmr, 1032);
assert.equal(loserMmr?.mmr, 976);

const winnerHistory = service.getPlayerMatches(playerOne.id);
assert.equal(winnerHistory.length, 1);
assert.equal(winnerHistory[0]?.result, "win");
assert.equal(winnerHistory[0]?.mmrDelta, 32);

const auditActions = service.getAuditLogs().map((entry) => entry.action);
assert.deepEqual(auditActions, ["mmr.update", "mmr.update"]);

const rankedConfig = service.getRankConfig().filter((config) => config.mode === "ranked");
assert.ok(rankedConfig.length >= 3);

console.log("matchmaking service tests passed");
