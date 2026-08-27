const API_BASE_URL = "/api/football";

async function apiRequest(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const url = `${API_BASE_URL}?${searchParams.toString()}`;

  console.log("Football API request:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Réponse serveur:", text);
    throw new Error("Réponse invalide du serveur.");
  }

  console.log("Football API response:", data);

  if (!response.ok) {
    throw new Error(
      data?.error || `Erreur API (${response.status})`
    );
  }

  return data;
}

export async function getLiveMatches() {
  return apiRequest({
    status: "LIVE",
  });
}

export async function getMatchesByDate(date) {
  return apiRequest({
    dateFrom: date,
    dateTo: date,
  });
}

export async function getMatchById(id) {
  return apiRequest({
    id,
  });
}

export async function getCompetitions() {
  return apiRequest({});
}
