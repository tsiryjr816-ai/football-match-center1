export default async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "API key non configurée sur le serveur."
    });
  }

  try {
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
      const value = req.query?.[key];

      if (value !== undefined && value !== "") {
        params.set(key, value);
      }
    }

    const url =
      `https://api.football-data.org/v4/matches` +
      (params.toString() ? `?${params.toString()}` : "");

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
    return res.status(500).json({
      error: "Impossible de contacter football-data.org."
    });
  }
}
