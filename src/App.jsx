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
  if (!utcDate) return "--:--";

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

      console.log("LIVE API:", data);

      setMatches(Array.isArray(data?.matches) ? data.matches : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur API");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCalendar(date) {
    try {
      setLoading(true);
      setError("");

      const dateString = formatDate(date);

      console.log("CALENDAR DATE:", dateString);

      const data = await getMatchesByDate(dateString);

      console.log("CALENDAR API:", data);

      setMatches(Array.isArray(data?.matches) ? data.matches : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur API");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (page === "live") {
      loadLive();
    }

    if (page === "calendar") {
      loadCalendar(selectedDate);
    }
  }, [page, selectedDate]);

  function changeDate(days) {
    const newDate = new Date(selectedDate);

    newDate.setDate(newDate.getDate() + days);

    setSelectedDate(newDate);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  function getStatusLabel(status) {
    switch (status) {
      case "TIMED":
        return "À venir";

      case "IN_PLAY":
        return "EN DIRECT";

      case "PAUSED":
        return "MI-TEMPS";

      case "FINISHED":
        return "TERMINÉ";

      case "SUSPENDED":
        return "SUSPENDU";

      case "POSTPONED":
        return "REPORTÉ";

      case "CANCELLED":
        return "ANNULÉ";

      default:
        return status || "INCONNU";
    }
  }

  return (
    <div className="app">

      <header className="header">
        <div className="header-content">

          <div className="brand">

            <div className="brand-icon">
              ⚽
            </div>

            <div>
              <h1>
                Football Match Center
              </h1>

              <p>
                Live scores & fixtures
              </p>
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
          onClick={() => handlePageChange("competitions")}
        >
          🏆 Compétitions
        </button>

      </nav>

      <main className="main-content">

        {page === "live" && (
          <section className="page-header">

            <div>
              <h2>
                Matchs en direct
              </h2>

              <p>
                Matchs actuellement en cours
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
                <h2>
                  📅 Calendrier
                </h2>

                <p>
                  Matchs du jour sélectionné
                </p>
              </div>

              <button
                className="refresh-button"
                onClick={() => loadCalendar(selectedDate)}
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
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
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
              <h2>
                🏆 Compétitions
              </h2>

              <p>
                Les compétitions seront ajoutées
                dans la prochaine étape.
              </p>
            </div>

          </section>
        )}

        {loading && (
          <section className="empty-state">

            <div className="empty-icon">
              ⚽
            </div>

            <h3>
              Chargement...
            </h3>

            <p>
              Récupération des données
              football-data.org
            </p>

          </section>
        )}

        {!loading && error && (
          <section className="empty-state">

            <div className="empty-icon">
              ⚠️
            </div>

            <h3>
              Erreur
            </h3>

            <p>
              {error}
            </p>

          </section>
        )}

        {!loading &&
          !error &&
          page !== "competitions" &&
          matches.length === 0 && (
            <section className="empty-state">

              <div className="empty-icon">
                ⚽
              </div>

              <h3>
                {page === "live"
                  ? "Aucun match en direct"
                  : "Aucun match"}
              </h3>

              <p>
                Aucune donnée disponible
                pour cette sélection.
              </p>

            </section>
          )}

        {!loading &&
          !error &&
          page !== "competitions" &&
          matches.length > 0 && (

            <section
              style={{
                display: "grid",
                gap: "15px",
              }}
            >

              {matches.map((match) => {

                const homeScore =
                  match.score?.fullTime?.home;

                const awayScore =
                  match.score?.fullTime?.away;

                return (
                  <article
                    key={match.id}
                    className="match-card"
                    style={{
                      padding: "18px",
                      borderRadius: "16px",
                      background: "#0f1d2e",
                      border: "1px solid #1e293b",
                    }}
                  >

                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >

                      <span>
                        {match.competition?.name ||
                          "Compétition"}
                      </span>

                      <span>
                        {formatMatchTime(match.utcDate)}
                      </span>

                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr auto 1fr",
                        alignItems: "center",
                        gap: "15px",
                        textAlign: "center",
                      }}
                    >

                      <div>

                        {match.homeTeam?.crest && (
                          <img
                            src={match.homeTeam.crest}
                            alt=""
                            style={{
                              width: "45px",
                              height: "45px",
                              objectFit: "contain",
                              marginBottom: "8px",
                            }}
                          />
                        )}

                        <div>
                          <strong>
                            {match.homeTeam?.shortName ||
                              match.homeTeam?.name ||
                              "Équipe domicile"}
                          </strong>
                        </div>

                      </div>

                      <div>

                        <strong
                          style={{
                            fontSize: "24px",
                          }}
                        >
                          {homeScore ?? "-"}
                          {" - "}
                          {awayScore ?? "-"}
                        </strong>

                        <div
                          style={{
                            marginTop: "6px",
                            color:
                              match.status === "FINISHED"
                                ? "#94a3b8"
                                : "#22c55e",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {getStatusLabel(match.status)}
                        </div>

                      </div>

                      <div>

                        {match.awayTeam?.crest && (
                          <img
                            src={match.awayTeam.crest}
                            alt=""
                            style={{
                              width: "45px",
                              height: "45px",
                              objectFit: "contain",
                              marginBottom: "8px",
                            }}
                          />
                        )}

                        <div>
                          <strong>
                            {match.awayTeam?.shortName ||
                              match.awayTeam?.name ||
                              "Équipe extérieure"}
                          </strong>
                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

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
