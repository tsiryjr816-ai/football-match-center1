import { useEffect, useState } from "react";
import {
  getLiveMatches,
  getMatchesByDate,
} from "./services/footballApi";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMatches() {
    try {
      setLoading(true);
      setError("");

      const data = await getLiveMatches();

      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">⚽</div>

            <div>
              <h1>Football Match Center</h1>
              <p>Live scores & fixtures</p>
            </div>
          </div>

          <div className="live-indicator">
            <span></span>
            LIVE
          </div>
        </div>
      </header>

      <nav className="navigation">
        <button className="nav-button active">
          🔴 Live
        </button>

        <button className="nav-button">
          📅 Calendrier
        </button>

        <button className="nav-button">
          🏆 Compétitions
        </button>
      </nav>

      <main className="main-content">
        <section className="page-header">
          <div>
            <h2>Matchs en direct</h2>
            <p>
              Matchs récupérés depuis football-data.org
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadMatches}
          >
            ↻ Actualiser
          </button>
        </section>

        {loading && (
          <section className="empty-state">
            <div className="empty-icon">⚽</div>
            <h3>Chargement des matchs...</h3>
            <p>
              Connexion à football-data.org
            </p>
          </section>
        )}

        {!loading && error && (
          <section className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Erreur</h3>
            <p>{error}</p>
          </section>
        )}

        {!loading &&
          !error &&
          matches.length === 0 && (
            <section className="empty-state">
              <div className="empty-icon">⚽</div>

              <h3>
                Aucun match en direct
              </h3>

              <p>
                Aucun match live n'est actuellement
                disponible.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          matches.length > 0 && (
            <section>
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="match-card"
                >
                  <div>
                    <strong>
                      {match.competition?.name}
                    </strong>
                  </div>

                  <div>
                    {match.homeTeam?.name}
                  </div>

                  <div>
                    {match.score?.fullTime?.home ?? 0}
                    {" - "}
                    {match.score?.fullTime?.away ?? 0}
                  </div>

                  <div>
                    {match.awayTeam?.name}
                  </div>

                  <div>
                    {match.status}
                  </div>
                </div>
              ))}
            </section>
          )}
      </main>
    </div>
  );
}

export default App;
