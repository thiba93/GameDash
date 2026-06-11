import assert from "node:assert/strict";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { MapsService } from "./maps.service";
import type { AuthenticatedUser } from "../auth/auth.types";

const service = new MapsService();

const creator: AuthenticatedUser = {
  id: "usr_map_creator",
  email: "creator@example.test",
  role: "player"
};

const player: AuthenticatedUser = {
  id: "usr_map_player",
  email: "player@example.test",
  role: "player"
};

const map = service.createMap(creator, {
  title: "Sky Arena",
  description: "Vertical duel arena with jump pads.",
  tags: ["Arena", "Ranked", "arena"],
  status: "beta"
});

assert.equal(map.creatorId, creator.id);
assert.equal(map.title, "Sky Arena");
assert.deepEqual(map.tags, ["arena", "ranked"]);
assert.equal(map.status, "beta");
assert.ok(map.popularityScore >= 0);

const version = service.createVersion(creator, map.id, {
  versionLabel: "v1",
  releaseNotes: "Initial beta layout."
});
assert.equal(version.mapId, map.id);
assert.equal(version.versionLabel, "v1");
assert.equal(version.releaseNotes, "Initial beta layout.");

assert.throws(
  () =>
    service.createVersion(creator, map.id, {
      versionLabel: "v1",
      releaseNotes: "Duplicate label."
    }),
  BadRequestException
);

const voted = service.voteMap(player, map.id, { value: 1 });
assert.equal(voted.accepted, true);
assert.equal(voted.map.stats.upvotes, 1);

const tested = service.testMap(player, map.id, { completed: true });
assert.equal(tested.map.stats.completedTests, 1);

const favorited = service.favoriteMap(player, map.id, { favorited: true });
assert.equal(favorited.map.stats.favorites, 1);
assert.ok(favorited.map.popularityScore > map.popularityScore);

const searchResults = service.listMaps({ q: "sky", tag: "arena", status: "beta" });
assert.equal(searchResults.length, 1);
assert.equal(searchResults[0]?.id, map.id);

const detail = service.getMap(map.id);
assert.equal(detail.versions.length, 1);
assert.equal(detail.stats.voteScore, 1);

const mapStats = service.getMapStats(map.id);
assert.equal(mapStats.versionCount, 1);
assert.equal(mapStats.upvotes, 1);
assert.equal(mapStats.completedTests, 1);
assert.equal(mapStats.favorites, 1);

const creatorStats = service.getCreatorStats(creator.id);
assert.equal(creatorStats.totalMaps, 1);
assert.equal(creatorStats.publishedMaps, 1);
assert.equal(creatorStats.totalVotes, 1);
assert.equal(creatorStats.totalTests, 1);
assert.equal(creatorStats.totalFavorites, 1);
assert.ok(creatorStats.averagePopularityScore > 0);

const auditActions = service.getAuditLogs().map((entry) => entry.action);
assert.deepEqual(auditActions, ["map.publish", "map.update"]);

assert.throws(() => service.voteMap(player, "missing-map", { value: 1 }), NotFoundException);

console.log("maps service tests passed");
