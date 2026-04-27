# Decision Log

## 2026-03-31
- Locked stack: Next.js (web) + NestJS (api).
- Locked workspace: pnpm + turborepo monorepo.
- Locked contracts strategy: OpenAPI first + shared TypeScript contracts package.
- Locked auth baseline: email/password + JWT access/refresh.
- Locked data baseline: PostgreSQL + Prisma + Redis.
- Locked realtime baseline: WebSocket namespaces with polling fallback.
- Locked target quality: MVP demo robuste.
- Locked CI posture for now: no CI in this phase.

## 2026-04-27
- Phase 1 auth runtime uses in-memory storage until Prisma repositories are wired in a later persistence pass.
- Passwords are hashed with PBKDF2-SHA512, access tokens are HMAC-signed, and refresh tokens are hash-stored and revocable.
- Admin dashboard access is restricted to `staff` and `admin` roles through Nest guards.
