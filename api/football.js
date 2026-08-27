export default async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "API key non configurée sur le serveur."
    });
  }

  try {
    const {
      id,
      status,
      dateFrom,
      dateTo,
      competitions,
      ids,
      limit
    } = req.query || {};

    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (competitions) {
      params.set("competitions", competitions);
    }
    if (ids) params.set("ids", ids);
    if (limit) params.set("limit", limit);

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
      return res.status(response.status).json({
        error:
          data?.message ||
          data?.error ||
          `Football API error: ${response.status}`
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Impossible de contacter football-data.org."
    });
  }
}
