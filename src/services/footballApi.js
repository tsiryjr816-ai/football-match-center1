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

  const response = await fetch(
    `${API_BASE_URL}${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Réponse invalide du serveur.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `Erreur API (${response.status})`
    );
  }

  return data;
}

/*
 * MATCHS EN DIRECT
 */
export async function getLiveMatches() {
  return apiRequest({
    status: "LIVE",
  });
}

/*
 * MATCHS D'UNE DATE
 */
export async function getMatchesByDate(date) {
  return apiRequest({
    dateFrom: date,
    dateTo: date,
  });
}

/*
 * MATCH PAR ID
 */
export async function getMatchById(id) {
  return apiRequest({
    id,
  });
}

/*
 * COMPÉTITIONS
 */
export async function getCompetitions() {
  return apiRequest({
    competitions: "PD",
  });
}
