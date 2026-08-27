const API_BASE_URL = "/api/football";

async function apiRequest(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  const url = query
    ? `${API_BASE_URL}?${query}`
    : API_BASE_URL;

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
    throw new Error(
      "Réponse invalide du serveur."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `Erreur API (${response.status})`
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
