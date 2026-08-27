export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API football
    if (url.pathname.startsWith("/api/football")) {
      return handleFootballAPI(request, env);
    }

    // Frontend React/Vite
    return env.ASSETS.fetch(request);
  },
};

async function handleFootballAPI(request, env) {
  if (request.method !== "GET") {
    return Response.json(
      {
        error: "Method not allowed",
      },
      {
        status: 405,
      }
    );
  }

  const apiKey = env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error: "FOOTBALL_DATA_API_KEY non configurée.",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const requestUrl = new URL(request.url);

    const params = new URLSearchParams();

    const allowedParams = [
      "status",
      "dateFrom",
      "dateTo",
      "competitions",
      "ids",
      "limit",
    ];

    for (const key of allowedParams) {
      const value = requestUrl.searchParams.get(key);

      if (value) {
        params.set(key, value);
      }
    }

    const id = requestUrl.searchParams.get("id");

    let endpoint = "/matches";

    if (id) {
      endpoint = `/matches/${encodeURIComponent(id)}`;
    }

    const query = params.toString();

    const apiUrl =
      `https://api.football-data.org/v4${endpoint}` +
      (query && !id ? `?${query}` : "");

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Auth-Token": apiKey,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error:
            data?.message ||
            `Football API error: ${response.status}`,
        },
        {
          status: response.status,
        }
      );
    }

    return Response.json(data, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, max-age=15, s-maxage=15",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error:
          "Impossible de contacter football-data.org.",
      },
      {
        status: 500,
      }
    );
  }
}
