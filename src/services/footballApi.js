const API_BASE_URL = "/api/football";

async function apiRequest(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  const url = `${API_BASE_URL}${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
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
