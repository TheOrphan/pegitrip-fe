import rateLimit from "lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function getNicknameML(req, res) {
  try {
    await limiter.check(res, 2, "CACHE_TOKEN"); // 2 requests per minute
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
  if (req.method === "POST") {
    // Process a POST request
    const { values, checkRoleAPI } = JSON.parse(req.body);
    if (checkRoleAPI?.api?.url) {
      const { api, variables } = checkRoleAPI;
      try {
        let body;
        if (api.type === "Multipart") {
          body = new URLSearchParams();
          for (const [key, value] of Object.entries(values)) {
            body.append(key, value);
          }
        }
        if (api.type === "Json") {
          body = values;
        }
        const reqNickname = await fetch(api.url, {
          method: api.method,
          body,
        });
        const response = await reqNickname.json();
        res.status(200).send({
          data: response,
        });
      } catch (e) {
        res.status(500).send({
          errMsg: JSON.stringify(e),
        });
        throw e;
      }
    }
  }
}
