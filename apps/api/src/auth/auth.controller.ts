import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from "@nestjs/common";
import type {
  AuthTokensResponse,
  LoginRequest,
  RefreshRequest,
  RegisterRequest
} from "@gamedash/contracts";

@Controller("auth")
export class AuthController {
  @Post("register")
  register(@Body() body: RegisterRequest): AuthTokensResponse {
    return {
      accessToken: `access-${body.email}`,
      refreshToken: `refresh-${body.email}`,
      role: "player"
    };
  }

  @Post("login")
  login(@Body() body: LoginRequest): AuthTokensResponse {
    return {
      accessToken: `access-${body.email}`,
      refreshToken: `refresh-${body.email}`,
      role: "player"
    };
  }

  @Post("refresh")
  refresh(@Body() body: RefreshRequest): AuthTokensResponse {
    return {
      accessToken: `access-from-${body.refreshToken}`,
      refreshToken: body.refreshToken,
      role: "player"
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(): void {
    return;
  }
}
