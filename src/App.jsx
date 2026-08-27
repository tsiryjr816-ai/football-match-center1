import { useEffect, useState } from "react";
import {
  getLiveMatches,
  getMatchesByDate,
} from "./services/footballApi";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMatchTime(utcDate) {
  if (!utcDate) return "";

  return new Date(utcDate).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [page, setPage] = useState("live");
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLive() {
    try {
      setLoading(true);
      setError("");

      const data = await getLiveMatches();

      console.log("LIVE DATA:", data);

      setMatches(Array.isArray(data?.matches) ? data.matches : []);
    } catch (err) {
      console.error("Live error:", err);
      setError(err.message || "Erreur inconnue.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCalendar(date) {
    try {
      setLoading(true);
      setError("");

      const formattedDate = formatDate(date);

      console.log("CALENDAR DATE:", formattedDate);

      const data = await getMatchesByDate(formattedDate);

      console.log("CALENDAR DATA:", data);

      setMatches(Array.isArray(data?.matches) ? data.matches : []);
    } catch (err) {
      console.error("Calendar error:", err);
      setError(err.message || "Erreur inconnue.");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (page === "calendar") {
      loadCalendar(selectedDate);
      return;
    }

    if (page === "live") {
      loadLive();

      const interval = setInterval(() => {
        loadLive();
      }, 30000);

      return () => clearInterval(interval);
    }

    setLoading(false);
    setMatches([]);
  }, [page, selectedDate]);

  function changeDate(days) {
    const newDate = new Date(selectedDate);

    newDate.setDate(newDate.getDate() + days);

    setSelectedDate(newDate);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    setError("");
  }

  function renderMatch(match) {
    const homeName =
      match?.homeTeam?.shortName ||
      match?.homeTeam?.name ||
      "Équipe domicile";

    const awayName =
      match?.awayTeam?.shortName ||
      match?.awayTeam?.name ||
      "Équipe extérieure";

    const homeScore = match?.score?.fullTime?.home;
    const awayScore = match?.score?.fullTime?.away;

    const isLive =
      match?.status === "IN_PLAY" ||
      match?.status === "PAUSED" ||
      match?.status === "LIVE";

    return (
      <article
        key={match.id}
        className="match-card"
        style={{
          padding: "18px",
          borderRadius: "16px",
          background: "#0f1d2e",
          border: "1px solid #1e293b",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          <span>
            {match?.competition?.name || "Compétition"}
          </span>

          <span
            style={{
              fontWeight: "bold",
              color: isLive ? "#22c55e" : "#94a3b8",
            }}
          >
            {isLive
              ? "🔴 EN DIRECT"
              : match?.status || "PROGRAMMÉ"}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "15px",
            textAlign: "center",
          }}
        >
          <div>
            {match?.homeTeam?.crest && (
              <img
                src={match.homeTeam.crest}
                alt={homeName}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain",
                  marginBottom: "8px",
                }}
              />
            )}

            <div>
              <strong>{homeName}</strong>
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              {homeScore ?? "-"} - {awayScore ?? "-"}
            </div>

            {!isLive && match?.utcDate && (
              <div
                style={{
                  marginTop: "6px",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                🕐 {formatMatchTime(match.utcDate)}
              </div>
            )}

            {isLive && (
              <div
                style={{
                  marginTop: "6px",
                  color: "#22c55e",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                MATCH EN COURS
              </div>
            )}
          </div>

          <div>
            {match?.awayTeam?.crest && (
              <img
                src={match.awayTeam.crest}
                alt={awayName}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain",
                  marginBottom: "8px",
                }}
              />
            )}

            <div>
              <strong>{awayName}</strong>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
      }}
    >
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
        <button
          className={`nav-button ${
            page === "live" ? "active" : ""
          }`}
          onClick={() => handlePageChange("live")}
        >
          🔴 Live
        </button>

        <button
          className={`nav-button ${
            page === "calendar" ? "active" : ""
          }`}
          onClick={() => handlePageChange("calendar")}
        >
          📅 Calendrier
        </button>

        <button
          className={`nav-button ${
            page === "competitions" ? "active" : ""
          }`}
          onClick={() =>
            handlePageChange("competitions")
          }
        >
          🏆 Compétitions
        </button>
      </nav>

      <main className="main-content">
        {page === "live" && (
          <section className="page-header">
            <div>
              <h2>Matchs en direct</h2>

              <p>
                Actualisation automatique toutes les
                30 secondes
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={loadLive}
            >
              ↻ Actualiser
            </button>
          </section>
        )}

        {page === "calendar" && (
          <section>
            <div className="page-header">
              <div>
                <h2>📅 Calendrier</h2>

                <p>
                  Matchs du jour sélectionné
                </p>
              </div>

              <button
                className="refresh-button"
                onClick={() =>
                  loadCalendar(selectedDate)
                }
              >
                ↻ Actualiser
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <button
                className="refresh-button"
                onClick={() => changeDate(-1)}
              >
                ← Jour précédent
              </button>

              <strong>
                {selectedDate.toLocaleDateString(
                  "fr-FR",
                  {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </strong>

              <button
                className="refresh-button"
                onClick={() => changeDate(1)}
              >
                Jour suivant →
              </button>
            </div>
          </section>
        )}

        {page === "competitions" && (
          <section className="page-header">
            <div>
              <h2>🏆 Compétitions</h2>

              <p>
                Les compétitions seront ajoutées
                dans la prochaine étape.
              </p>
            </div>
          </section>
        )}

        {loading && (
          <section className="empty-state">
            <div className="empty-icon">⚽</div>

            <h3>Chargement...</h3>

            <p>
              Récupération des données
              football-data.org
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
          page !== "competitions" &&
          matches.length === 0 && (
            <section className="empty-state">
              <div className="empty-icon">⚽</div>

              <h3>
                {page === "live"
                  ? "Aucun match en direct"
                  : "Aucun match"}
              </h3>

              <p>
                Aucune donnée disponible pour cette
                sélection.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          matches.length > 0 && (
            <section
              style={{
                display: "grid",
                gap: "15px",
              }}
            >
              {matches.map(renderMatch)}
            </section>
          )}

        <footer
          style={{
            marginTop: "40px",
            padding: "20px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "12px",
          }}
        >
          Data provided by football-data.org
        </footer>
      </main>
    </div>
  );
}

export default App;
