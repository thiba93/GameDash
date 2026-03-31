import type { HealthResponse } from "@gamedash/contracts";

const modules = [
  "Auth and identity",
  "Matchmaking and MMR",
  "Economy and inventory",
  "UGC maps",
  "Admin monitoring"
];

const apiHealthContract: HealthResponse = {
  status: "ok",
  time: new Date().toISOString()
};

export default function HomePage() {
  return (
    <main className="container">
      <h1>GameDash Foundation</h1>
      <p>
        Web shell is initialized. API contract baseline is locked under{" "}
        <code>/api/v1</code>.
      </p>

      <section>
        <h2>Locked modules</h2>
        <ul>
          {modules.map((moduleName) => (
            <li key={moduleName}>{moduleName}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Contract sample</h2>
        <pre>{JSON.stringify(apiHealthContract, null, 2)}</pre>
      </section>
    </main>
  );
}
