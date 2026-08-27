const API_BASE_URL = "https://api.football-data.org/v4";

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;

async function apiRequest(endpoint) {
  if (!API_KEY) {
    throw new Error("API key football-data.org manquante.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "X-Auth-Token": API_KEY,
    },
  });

  if (response.status === 401) {
    throw new Error("API key invalide.");
  }

  if (response.status === 403) {
    throw new Error("Accès API refusé.");
  }

  if (response.status === 429) {
    throw new Error("Limite API atteinte. Réessayez plus tard.");
  }

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const data = await response.json();

  return data;
}

export async function getMatches(params = "") {
  return apiRequest(`/matches${params}`);
}

export async function getLiveMatches() {
  return apiRequest(
    "/matches?status=IN_PLAY,PAUSED"
  );
}

export async function getMatchesByDate(date) {
  return apiRequest(
    `/matches?dateFrom=${date}&dateTo=${date}`
  );
}

export async function getMatchById(id) {
  return apiRequest(`/matches/${id}`);
}

export async function getCompetitions() {
  return apiRequest("/competitions");
}
