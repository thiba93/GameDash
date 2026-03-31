# Risk Register

| ID | Risk | Impact | Trigger | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | Scope drift into optional features | High | P2 work starts before P0 closure | Enforce P0 gate in backlog and AGENTS rules | Product lead |
| R2 | MMR logic inconsistency | High | Different formulas used across modules | Single MMR contract + shared types + tests | Backend lead |
| R3 | Weak auth/session handling | High | Missing refresh rotation or secret hygiene | Security baseline + env discipline + audit rules | Backend lead |
| R4 | Economy data corruption | High | Non-idempotent transaction writes | Transaction model + explicit invariants + audit log | Backend lead |
| R5 | UGC moderation gap | Medium | Harmful content not actionable | Moderation entities + admin endpoints + decision log | Product/staff |
| R6 | Local setup fragmentation | Medium | Team cannot run same stack locally | Native setup guide + health checks + env template | Tech lead |
| R7 | Contract drift between API and shared types | Medium | DTO mismatch during implementation | OpenAPI-first + `packages/contracts` sync policy | Tech lead |
| R8 | Realtime instability | Medium | WebSocket disconnects break UX | Document polling fallback and expose fallback endpoints | Full-stack lead |
