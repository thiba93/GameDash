import type {
  AuthTokensResponse,
  MatchHistoryItem,
  PlayerMmrResponse,
  QueueStatusResponse,
  RankConfig,
  RegisterRequest
} from "@gamedash/contracts";

const registrationPayload: RegisterRequest = {
  email: "player@example.test",
  password: "minimum-8",
  pseudo: "PlayerOne",
  avatarUrl: "https://cdn.example.test/avatar.png",
  region: "EU",
  bio: "Ranked and UGC map player"
};

const authContract: AuthTokensResponse = {
  accessToken: "jwt-access-token",
  refreshToken: "gd_rt_refresh-token",
  role: "player",
  user: {
    id: "usr_demo",
    email: registrationPayload.email,
    role: "player",
    profile: {
      userId: "usr_demo",
      pseudo: registrationPayload.pseudo,
      avatarUrl: registrationPayload.avatarUrl,
      region: registrationPayload.region,
      bio: registrationPayload.bio
    }
  }
};

const queueStatus: QueueStatusResponse = {
  playerId: "usr_demo",
  state: "in_match",
  mode: "ranked",
  matchId: "7cfb7e0c-91f5-4bd7-b8ac-9843d3aa42c9",
  opponentPlayerId: "usr_rival",
  estimatedWaitSeconds: 0
};

const mmr: PlayerMmrResponse = {
  playerId: "usr_demo",
  ratings: [
    { mode: "ranked", mmr: 1032, rank: "BRONZE II" },
    { mode: "unranked", mmr: 1000, rank: "UNRANKED" },
    { mode: "fun", mmr: 1000, rank: "CASUAL" }
  ]
};

const recentMatches: MatchHistoryItem[] = [
  {
    matchId: queueStatus.matchId ?? "match-demo",
    mode: "ranked",
    createdAt: "2026-06-11T10:00:00.000Z",
    finishedAt: "2026-06-11T10:08:00.000Z",
    result: "win",
    opponentPlayerId: queueStatus.opponentPlayerId,
    mmrBefore: 1000,
    mmrAfter: 1032,
    mmrDelta: 32,
    rankBefore: "BRONZE II",
    rankAfter: "BRONZE II"
  }
];

const rankConfig: RankConfig[] = [
  { mode: "ranked", minMmr: 0, maxMmr: 899, rank: "BRONZE III", sortOrder: 10 },
  { mode: "ranked", minMmr: 900, maxMmr: 1099, rank: "BRONZE II", sortOrder: 20 },
  { mode: "ranked", minMmr: 1100, maxMmr: 1299, rank: "SILVER I", sortOrder: 30 }
];

export default function HomePage() {
  return (
    <main className="container">
      <h1>GameDash Player Access</h1>

      <section className="auth-grid" aria-label="Authentication baseline">
        <form className="panel">
          <h2>Create account</h2>
          <label>
            Email
            <input defaultValue={registrationPayload.email} type="email" />
          </label>
          <label>
            Password
            <input defaultValue={registrationPayload.password} type="password" />
          </label>
          <label>
            Pseudo
            <input defaultValue={registrationPayload.pseudo} />
          </label>
          <label>
            Region
            <input defaultValue={registrationPayload.region} />
          </label>
          <button type="button">Register</button>
        </form>

        <section className="panel">
          <h2>Session contract</h2>
          <dl>
            <div>
              <dt>Role</dt>
              <dd>{authContract.role}</dd>
            </div>
            <div>
              <dt>Profile</dt>
              <dd>{authContract.user.profile.pseudo}</dd>
            </div>
            <div>
              <dt>Refresh</dt>
              <dd>Server revocable</dd>
            </div>
          </dl>
        </section>
      </section>

      <section>
        <h2>Protected routes</h2>
        <ul className="route-list">
          <li>
            <code>GET /api/v1/auth/me</code>
            <span>Bearer token required</span>
          </li>
          <li>
            <code>GET /api/v1/players/me/profile</code>
            <span>Player profile baseline</span>
          </li>
          <li>
            <code>GET /api/v1/admin/dashboard</code>
            <span>Staff or admin only</span>
          </li>
        </ul>
      </section>

      <section className="competition-grid" aria-label="Competitive loop baseline">
        <section className="panel">
          <h2>Matchmaking</h2>
          <dl>
            <div>
              <dt>State</dt>
              <dd>{queueStatus.state}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{queueStatus.mode}</dd>
            </div>
            <div>
              <dt>Match</dt>
              <dd>{queueStatus.matchId}</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h2>MMR</h2>
          <ul className="rating-list">
            {mmr.ratings.map((rating) => (
              <li key={rating.mode}>
                <span>{rating.mode}</span>
                <strong>{rating.mmr}</strong>
                <em>{rating.rank}</em>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section className="competition-grid" aria-label="Match history and ranks">
        <section className="panel">
          <h2>Recent matches</h2>
          <ul className="history-list">
            {recentMatches.map((match) => (
              <li key={match.matchId}>
                <span>{match.mode}</span>
                <strong>{match.result}</strong>
                <em>
                  {match.mmrBefore} to {match.mmrAfter} ({match.mmrDelta})
                </em>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Rank map</h2>
          <ul className="history-list">
            {rankConfig.map((rank) => (
              <li key={`${rank.mode}-${rank.rank}`}>
                <span>{rank.rank}</span>
                <strong>{rank.minMmr}+</strong>
                <em>{rank.mode}</em>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
