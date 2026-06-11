import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import type {
  CreateMapRequest,
  CreateMapVersionRequest,
  CreatorMapStatsResponse,
  FavoriteMapRequest,
  MapDetailResponse,
  MapInteractionResponse,
  MapStatsResponse,
  MapStatus,
  MapSummary,
  MapVersionResponse,
  TestMapRequest,
  VoteMapRequest
} from "@gamedash/contracts";
import type { AuthenticatedUser } from "../auth/auth.types";

interface StoredMap {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  tags: string[];
  status: MapStatus;
  popularityScore: number;
  createdAt: string;
  updatedAt: string;
  versions: MapVersionResponse[];
  votes: Map<string, -1 | 1>;
  tests: Map<string, boolean>;
  favorites: Set<string>;
}

interface MapAuditEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface ListMapsQuery {
  q?: string;
  tag?: string;
  status?: MapStatus;
  creatorId?: string;
}

const MAP_STATUSES: MapStatus[] = ["draft", "beta", "stable", "hidden"];
const MAX_TAGS = 8;

@Injectable()
export class MapsService {
  private readonly maps = new Map<string, StoredMap>();
  private readonly auditLogs: MapAuditEntry[] = [];

  listMaps(query: ListMapsQuery = {}): MapSummary[] {
    const search = query.q?.trim().toLowerCase();
    const tag = query.tag?.trim().toLowerCase();

    return [...this.maps.values()]
      .filter((map) => (query.status ? map.status === query.status : map.status !== "hidden"))
      .filter((map) => (query.creatorId ? map.creatorId === query.creatorId : true))
      .filter((map) => (tag ? map.tags.some((mapTag) => mapTag.toLowerCase() === tag) : true))
      .filter((map) => {
        if (!search) {
          return true;
        }

        return (
          map.title.toLowerCase().includes(search) ||
          map.description.toLowerCase().includes(search) ||
          map.tags.some((mapTag) => mapTag.toLowerCase().includes(search))
        );
      })
      .sort((a, b) => b.popularityScore - a.popularityScore || b.updatedAt.localeCompare(a.updatedAt))
      .map((map) => this.toSummary(map));
  }

  createMap(actor: AuthenticatedUser, body: CreateMapRequest): MapSummary {
    const now = new Date().toISOString();
    const status = this.assertStatus(body.status);
    const map: StoredMap = {
      id: randomUUID(),
      creatorId: actor.id,
      title: this.assertText(body.title, "Map title"),
      description: this.assertText(body.description, "Map description"),
      tags: this.normalizeTags(body.tags ?? []),
      status,
      popularityScore: 0,
      createdAt: now,
      updatedAt: now,
      versions: [],
      votes: new Map<string, -1 | 1>(),
      tests: new Map<string, boolean>(),
      favorites: new Set<string>()
    };
    this.recalculatePopularity(map);
    this.maps.set(map.id, map);
    this.audit(actor.id, this.isPublishedStatus(status) ? "map.publish" : "map.create", "map", map.id, {
      status,
      tags: map.tags
    });

    return this.toSummary(map);
  }

  getMap(mapId: string): MapDetailResponse {
    const map = this.getStoredMap(mapId);

    return {
      ...this.toSummary(map),
      versions: [...map.versions]
    };
  }

  createVersion(
    actor: AuthenticatedUser,
    mapId: string,
    body: CreateMapVersionRequest
  ): MapVersionResponse {
    const map = this.getStoredMap(mapId);
    this.assertCreator(actor, map);

    if (map.versions.some((version) => version.versionLabel === body.versionLabel)) {
      throw new BadRequestException("Map version label already exists.");
    }

    const now = new Date().toISOString();
    const version: MapVersionResponse = {
      id: randomUUID(),
      mapId,
      versionLabel: this.assertText(body.versionLabel, "Version label"),
      releaseNotes: this.assertText(body.releaseNotes, "Release notes"),
      createdAt: now
    };
    map.versions.unshift(version);
    map.updatedAt = now;
    this.recalculatePopularity(map);
    this.audit(actor.id, "map.update", "map", map.id, {
      versionId: version.id,
      versionLabel: version.versionLabel
    });

    return version;
  }

  voteMap(actor: AuthenticatedUser, mapId: string, body: VoteMapRequest): MapInteractionResponse {
    const map = this.getStoredMap(mapId);

    if (body.value !== 1 && body.value !== -1) {
      throw new BadRequestException("Vote value must be 1 or -1.");
    }

    map.votes.set(actor.id, body.value);
    map.updatedAt = new Date().toISOString();
    this.recalculatePopularity(map);

    return {
      accepted: true,
      map: this.toSummary(map)
    };
  }

  testMap(actor: AuthenticatedUser, mapId: string, body: TestMapRequest): MapInteractionResponse {
    const map = this.getStoredMap(mapId);

    map.tests.set(actor.id, Boolean(body.completed));
    map.updatedAt = new Date().toISOString();
    this.recalculatePopularity(map);

    return {
      accepted: true,
      map: this.toSummary(map)
    };
  }

  favoriteMap(
    actor: AuthenticatedUser,
    mapId: string,
    body: FavoriteMapRequest
  ): MapInteractionResponse {
    const map = this.getStoredMap(mapId);

    if (body.favorited) {
      map.favorites.add(actor.id);
    } else {
      map.favorites.delete(actor.id);
    }

    map.updatedAt = new Date().toISOString();
    this.recalculatePopularity(map);

    return {
      accepted: true,
      map: this.toSummary(map)
    };
  }

  getMapStats(mapId: string): MapStatsResponse {
    return this.calculateStats(this.getStoredMap(mapId));
  }

  getCreatorStats(creatorId: string): CreatorMapStatsResponse {
    const maps = [...this.maps.values()].filter((map) => map.creatorId === creatorId);
    const stats = maps.map((map) => this.calculateStats(map));
    const totalVotes = stats.reduce((sum, stat) => sum + stat.upvotes + stat.downvotes, 0);
    const totalTests = stats.reduce((sum, stat) => sum + stat.completedTests, 0);
    const totalFavorites = stats.reduce((sum, stat) => sum + stat.favorites, 0);
    const averagePopularityScore =
      maps.length === 0
        ? 0
        : Number(
            (maps.reduce((sum, map) => sum + map.popularityScore, 0) / maps.length).toFixed(2)
          );

    return {
      creatorId,
      totalMaps: maps.length,
      publishedMaps: maps.filter((map) => map.status === "beta" || map.status === "stable").length,
      totalVotes,
      totalTests,
      totalFavorites,
      averagePopularityScore
    };
  }

  getAuditLogs(): MapAuditEntry[] {
    return [...this.auditLogs];
  }

  private getStoredMap(mapId: string): StoredMap {
    const map = this.maps.get(mapId);
    if (!map) {
      throw new NotFoundException("Map not found.");
    }

    return map;
  }

  private assertCreator(actor: AuthenticatedUser, map: StoredMap): void {
    if (map.creatorId === actor.id || actor.role === "admin" || actor.role === "staff") {
      return;
    }

    throw new BadRequestException("Only the creator or studio staff can update this map.");
  }

  private assertStatus(status: MapStatus): MapStatus {
    if (!MAP_STATUSES.includes(status)) {
      throw new BadRequestException("Unsupported map status.");
    }

    return status;
  }

  private isPublishedStatus(status: MapStatus): boolean {
    return status === "beta" || status === "stable";
  }

  private assertText(value: string, label: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new BadRequestException(`${label} is required.`);
    }

    return trimmed;
  }

  private normalizeTags(tags: string[]): string[] {
    const normalized = [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
    if (normalized.length > MAX_TAGS) {
      throw new BadRequestException(`A map can have at most ${MAX_TAGS} tags.`);
    }

    return normalized;
  }

  private recalculatePopularity(map: StoredMap): void {
    map.popularityScore = this.calculateStats(map).popularityScore;
  }

  private calculateStats(map: StoredMap): MapStatsResponse {
    const votes = [...map.votes.values()];
    const upvotes = votes.filter((value) => value === 1).length;
    const downvotes = votes.filter((value) => value === -1).length;
    const completedTests = [...map.tests.values()].filter(Boolean).length;
    const favorites = map.favorites.size;
    const versionCount = map.versions.length;
    const ageDays = Math.max(
      0,
      Math.floor((Date.now() - Date.parse(map.updatedAt)) / (1000 * 60 * 60 * 24))
    );
    const recencyBoost = Math.max(0, 10 - ageDays);
    const voteScore = upvotes - downvotes;
    const popularityScore = Math.max(
      0,
      Number(
        (
          voteScore * 10 +
          completedTests * 5 +
          favorites * 3 +
          versionCount * 2 +
          recencyBoost
        ).toFixed(2)
      )
    );

    return {
      mapId: map.id,
      versionCount,
      voteScore,
      upvotes,
      downvotes,
      completedTests,
      favorites,
      popularityScore
    };
  }

  private toSummary(map: StoredMap): MapSummary {
    return {
      id: map.id,
      creatorId: map.creatorId,
      title: map.title,
      description: map.description,
      tags: [...map.tags],
      status: map.status,
      popularityScore: map.popularityScore,
      latestVersionLabel: map.versions[0]?.versionLabel,
      createdAt: map.createdAt,
      updatedAt: map.updatedAt,
      stats: this.calculateStats(map)
    };
  }

  private audit(
    actorId: string,
    action: string,
    targetType: string,
    targetId?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.auditLogs.push({
      id: randomUUID(),
      actorId,
      action,
      targetType,
      targetId,
      metadata,
      createdAt: new Date().toISOString()
    });
  }
}
