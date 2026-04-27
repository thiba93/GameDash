import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import type {
  AuthTokensResponse,
  AuthUserResponse,
  LoginRequest,
  LogoutRequest,
  PlayerProfileResponse,
  RefreshRequest,
  RegisterRequest,
  Role,
  UpdatePlayerProfileRequest
} from "@gamedash/contracts";
import type { AuthenticatedUser } from "./auth.types";

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  profile: PlayerProfileResponse;
  createdAt: string;
}

interface StoredRefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  revokedAt?: string;
  expiresAt: string;
  createdAt: string;
}

interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface AccessPayload {
  sub: string;
  email: string;
  role: Role;
  exp: number;
}

@Injectable()
export class AuthService {
  private readonly users = new Map<string, StoredUser>();
  private readonly usersByEmail = new Map<string, string>();
  private readonly refreshTokens = new Map<string, StoredRefreshToken>();
  private readonly auditLogs: AuditEntry[] = [];
  private readonly accessTtlSeconds = 15 * 60;
  private readonly refreshTtlSeconds = 30 * 24 * 60 * 60;
  private readonly accessSecret =
    process.env.JWT_ACCESS_SECRET ?? "local-dev-access-secret-change-me";

  register(body: RegisterRequest): AuthTokensResponse {
    const email = this.normalizeEmail(body.email);
    this.assertPassword(body.password);
    const pseudo = this.assertText(body.pseudo, "pseudo");

    if (this.usersByEmail.has(email)) {
      throw new BadRequestException("Email already registered.");
    }

    const user: StoredUser = {
      id: cryptoRandomId("usr"),
      email,
      passwordHash: this.hashPassword(body.password),
      role: "player",
      profile: {
        userId: "",
        pseudo,
        avatarUrl: normalizeOptional(body.avatarUrl),
        region: normalizeOptional(body.region),
        bio: normalizeOptional(body.bio)
      },
      createdAt: new Date().toISOString()
    };
    user.profile.userId = user.id;

    this.users.set(user.id, user);
    this.usersByEmail.set(user.email, user.id);
    this.audit(user.id, "auth.register", "user", user.id, { role: user.role });

    return this.issueTokenPair(user, "auth.register.tokens_issued");
  }

  login(body: LoginRequest): AuthTokensResponse {
    const email = this.normalizeEmail(body.email);
    const user = this.findByEmail(email);

    if (!user || !this.verifyPassword(body.password, user.passwordHash)) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    this.audit(user.id, "auth.login", "user", user.id);
    return this.issueTokenPair(user, "auth.login.tokens_issued");
  }

  refresh(body: RefreshRequest): AuthTokensResponse {
    const tokenHash = this.hashToken(body.refreshToken);
    const token = this.refreshTokens.get(tokenHash);

    if (!token || token.revokedAt || new Date(token.expiresAt) <= new Date()) {
      throw new UnauthorizedException("Refresh token is invalid or expired.");
    }

    const user = this.requireUser(token.userId);
    token.revokedAt = new Date().toISOString();
    this.audit(user.id, "auth.refresh", "refresh_token", token.id);

    return this.issueTokenPair(user, "auth.refresh.tokens_issued");
  }

  logout(body: LogoutRequest, actor: AuthenticatedUser): void {
    const tokenHash = this.hashToken(body.refreshToken);
    const token = this.refreshTokens.get(tokenHash);

    if (!token || token.userId !== actor.id || token.revokedAt) {
      throw new UnauthorizedException("Refresh token is invalid.");
    }

    token.revokedAt = new Date().toISOString();
    this.audit(actor.id, "auth.logout", "refresh_token", token.id);
  }

  verifyAccessToken(accessToken: string): AuthenticatedUser {
    const parts = accessToken.split(".");
    if (parts.length !== 3) {
      throw new UnauthorizedException("Malformed access token.");
    }

    const [encodedHeader, encodedPayload, signature] = parts as [string, string, string];
    const expectedSignature = this.sign(`${encodedHeader}.${encodedPayload}`);

    if (!safeEqual(signature, expectedSignature)) {
      throw new UnauthorizedException("Invalid access token signature.");
    }

    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AccessPayload;
    if (!payload.sub || !payload.email || !payload.role || payload.exp <= nowSeconds()) {
      throw new UnauthorizedException("Access token is invalid or expired.");
    }

    const user = this.requireUser(payload.sub);
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  getCurrentUser(actor: AuthenticatedUser): AuthUserResponse {
    return this.toAuthUser(this.requireUser(actor.id));
  }

  getProfile(actor: AuthenticatedUser): PlayerProfileResponse {
    return this.requireUser(actor.id).profile;
  }

  updateProfile(
    actor: AuthenticatedUser,
    body: UpdatePlayerProfileRequest
  ): PlayerProfileResponse {
    const user = this.requireUser(actor.id);
    const nextProfile: PlayerProfileResponse = {
      ...user.profile,
      pseudo: body.pseudo ? this.assertText(body.pseudo, "pseudo") : user.profile.pseudo,
      avatarUrl:
        body.avatarUrl === undefined ? user.profile.avatarUrl : normalizeOptional(body.avatarUrl),
      region: body.region === undefined ? user.profile.region : normalizeOptional(body.region),
      bio: body.bio === undefined ? user.profile.bio : normalizeOptional(body.bio)
    };

    user.profile = nextProfile;
    this.audit(actor.id, "profile.update", "user", user.id);
    return nextProfile;
  }

  getAuditLogs(): AuditEntry[] {
    return [...this.auditLogs];
  }

  private issueTokenPair(user: StoredUser, action: string): AuthTokensResponse {
    const accessToken = this.createAccessToken(user);
    const refreshToken = `gd_rt_${randomBytes(32).toString("base64url")}`;
    const refreshRecord: StoredRefreshToken = {
      id: cryptoRandomId("rft"),
      userId: user.id,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + this.refreshTtlSeconds * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    this.refreshTokens.set(refreshRecord.tokenHash, refreshRecord);
    this.audit(user.id, action, "refresh_token", refreshRecord.id);

    return {
      accessToken,
      refreshToken,
      role: user.role,
      user: this.toAuthUser(user)
    };
  }

  private createAccessToken(user: StoredUser): string {
    const encodedHeader = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const encodedPayload = toBase64Url(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: nowSeconds() + this.accessTtlSeconds
      } satisfies AccessPayload)
    );
    const unsigned = `${encodedHeader}.${encodedPayload}`;
    return `${unsigned}.${this.sign(unsigned)}`;
  }

  private sign(value: string): string {
    return createHmac("sha256", this.accessSecret).update(value).digest("base64url");
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString("base64url");
    const derived = pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("base64url");
    return `pbkdf2_sha512$120000$${salt}$${derived}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [algorithm, iterationsRaw, salt, expected] = storedHash.split("$");
    if (algorithm !== "pbkdf2_sha512" || !iterationsRaw || !salt || !expected) {
      return false;
    }

    const actual = pbkdf2Sync(
      password,
      salt,
      Number(iterationsRaw),
      64,
      "sha512"
    ).toString("base64url");
    return safeEqual(actual, expected);
  }

  private hashToken(token: string): string {
    return createHmac("sha256", this.accessSecret).update(token).digest("hex");
  }

  private normalizeEmail(email: string): string {
    const normalized = normalizeOptional(email)?.toLowerCase();
    if (!normalized || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
      throw new BadRequestException("A valid email is required.");
    }

    return normalized;
  }

  private assertPassword(password: string): void {
    if (typeof password !== "string" || password.length < 8) {
      throw new BadRequestException("Password must contain at least 8 characters.");
    }
  }

  private assertText(value: string, field: string): string {
    const normalized = normalizeOptional(value);
    if (!normalized) {
      throw new BadRequestException(`${field} is required.`);
    }

    return normalized;
  }

  private findByEmail(email: string): StoredUser | undefined {
    const userId = this.usersByEmail.get(email);
    return userId ? this.users.get(userId) : undefined;
  }

  private requireUser(userId: string): StoredUser {
    const user = this.users.get(userId);
    if (!user) {
      throw new UnauthorizedException("User no longer exists.");
    }

    return user;
  }

  private toAuthUser(user: StoredUser): AuthUserResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile
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
      id: cryptoRandomId("aud"),
      actorId,
      action,
      targetType,
      targetId,
      metadata,
      createdAt: new Date().toISOString()
    });
  }
}

function cryptoRandomId(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

function normalizeOptional(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}
