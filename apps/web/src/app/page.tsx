import type { AuthTokensResponse, RegisterRequest } from "@gamedash/contracts";

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
    </main>
  );
}
