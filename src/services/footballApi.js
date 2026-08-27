const API_BASE_URL = "/api/football";

async function apiRequest(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  const response = await fetch(
    `${API_BASE_URL}${query ? `?${query}` : ""}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Erreur lors de la connexion à l'API."
    );
  }

  return data;
}

export async function getLiveMatches() {
  return apiRequest({
    status: "LIVE"
  });
}

export async function getMatchesByDate(date) {
  return apiRequest({
    dateFrom: date,
    dateTo: date
  });
}

export async function getMatchById(id) {
  const response = await fetch(`/api/football?id=${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Impossible de récupérer le match."
    );
  }

  return data;
}

export async function getCompetitions() {
  const response = await fetch(
    "https://api.football-data.org/v4/competitions"
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de récupérer les compétitions."
    );
  }

  return response.json();
}
