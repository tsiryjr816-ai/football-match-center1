export async function onRequestGet(context) {
  const apiKey = context.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error: "API key non configurée sur Cloudflare."
      },
      { status: 500 }
    );
  }

  try {
    const requestUrl = new URL(context.request.url);

    const params = new URLSearchParams();

    const allowedParams = [
      "status",
      "dateFrom",
      "dateTo",
      "competitions",
      "ids",
      "limit"
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

    const url =
      `https://api.football-data.org/v4${endpoint}` +
      (query && !id ? `?${query}` : "");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Auth-Token": apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error:
            data?.message ||
            `Football API error: ${response.status}`
        },
        { status: response.status }
      );
    }

    return Response.json(data);

  } catch (error) {
    return Response.json(
      {
        error:
          "Impossible de contacter football-data.org."
      },
      { status: 500 }
    );
  }
}
