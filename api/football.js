export default async function handler(req, res) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "FOOTBALL_DATA_API_KEY is not configured",
    });
  }

  try {
    const query = new URLSearchParams(req.query).toString();

    const url = `https://api.football-data.org/v4/matches${
      query ? `?${query}` : ""
    }`;

    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Unable to connect to football-data.org",
    });
  }
}
