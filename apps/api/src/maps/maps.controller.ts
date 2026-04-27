import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import type {
  ActionAcceptedResponse,
  CreateMapRequest,
  CreateMapVersionRequest,
  MapSummary,
  MapVersionResponse,
  TestMapRequest,
  VoteMapRequest
} from "@gamedash/contracts";
import { AuthGuard } from "../auth/auth.guard";

@Controller("maps")
@UseGuards(AuthGuard)
export class MapsController {
  @Get()
  listMaps(): MapSummary[] {
    return [
      {
        id: "map-1",
        title: "Sky Arena",
        status: "stable",
        popularityScore: 84.5
      }
    ];
  }

  @Post()
  createMap(@Body() body: CreateMapRequest): MapSummary {
    return {
      id: `map-${Date.now()}`,
      title: body.title,
      status: body.status,
      popularityScore: 0
    };
  }

  @Post(":mapId/versions")
  createVersion(
    @Param("mapId") mapId: string,
    @Body() body: CreateMapVersionRequest
  ): MapVersionResponse {
    return {
      mapId,
      versionLabel: body.versionLabel,
      createdAt: new Date().toISOString()
    };
  }

  @Post(":mapId/votes")
  voteMap(
    @Param("mapId") mapId: string,
    @Body() body: VoteMapRequest
  ): ActionAcceptedResponse {
    return {
      accepted: Boolean(mapId && body.value)
    };
  }

  @Post(":mapId/tests")
  testMap(
    @Param("mapId") mapId: string,
    @Body() body: TestMapRequest
  ): ActionAcceptedResponse {
    return {
      accepted: Boolean(mapId && body.completed)
    };
  }
}
