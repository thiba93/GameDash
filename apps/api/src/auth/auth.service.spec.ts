import assert from "node:assert/strict";
import { UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

const auth = new AuthService();

const registered = auth.register({
  email: "Player@One.test",
  password: "correct-password",
  pseudo: "PlayerOne",
  avatarUrl: "https://cdn.example.test/avatar.png",
  region: "EU",
  bio: "Competitive player"
});

assert.equal(registered.role, "player");
assert.equal(registered.user.email, "player@one.test");
assert.equal(registered.user.profile.pseudo, "PlayerOne");
assert.ok(registered.accessToken.includes("."));
assert.ok(registered.refreshToken.startsWith("gd_rt_"));

const actor = auth.verifyAccessToken(registered.accessToken);
assert.equal(actor.id, registered.user.id);
assert.equal(actor.role, "player");

const login = auth.login({
  email: "player@one.test",
  password: "correct-password"
});
assert.equal(login.user.id, registered.user.id);
assert.notEqual(login.refreshToken, registered.refreshToken);

assert.throws(
  () =>
    auth.login({
      email: "player@one.test",
      password: "wrong-password"
    }),
  UnauthorizedException
);

const refreshed = auth.refresh({ refreshToken: login.refreshToken });
assert.equal(refreshed.user.id, registered.user.id);
assert.notEqual(refreshed.refreshToken, login.refreshToken);

assert.throws(
  () => auth.refresh({ refreshToken: login.refreshToken }),
  UnauthorizedException
);

auth.logout({ refreshToken: refreshed.refreshToken }, actor);
assert.throws(
  () => auth.refresh({ refreshToken: refreshed.refreshToken }),
  UnauthorizedException
);

const profile = auth.updateProfile(actor, {
  pseudo: "PlayerPrime",
  bio: "Updated bio"
});
assert.equal(profile.pseudo, "PlayerPrime");
assert.equal(profile.bio, "Updated bio");

const auditActions = auth.getAuditLogs().map((entry) => entry.action);
assert.ok(auditActions.includes("auth.register"));
assert.ok(auditActions.includes("auth.login"));
assert.ok(auditActions.includes("auth.refresh"));
assert.ok(auditActions.includes("auth.logout"));
assert.ok(auditActions.includes("profile.update"));

console.log("auth service tests passed");
