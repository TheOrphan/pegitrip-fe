import pbAuth from "../auth/pb";
import getBase64FromUrl from "../../../lib/getBase64FromUrl";
import rateLimit from "lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function getBanner(req, res) {
  try {
    await limiter.check(res, 20, "CACHE_TOKEN"); // 2 requests per minute
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
  if (req.method === "GET") {
    // Process a GET request
    try {
      const pb = await pbAuth();
      const bannerRecords = await pb.collection("banners").getFullList(10, {
        filter: 'type = "slider"',
      });
      const banners = [];
      for (let bannerIdx = 0; bannerIdx < bannerRecords.length; bannerIdx++) {
        const banner = bannerRecords[bannerIdx];
        banners[bannerIdx] = {
          priority: banner.priority,
          imageSrc: await getBase64FromUrl(
            `${process.env.NEXT_PUBLIC_BE_URI}/api/files/banners/${banner.id}/${banner.image}`
          ),
        };
      }
      pb.authStore.clear();
      res.status(200).send({
        data: banners,
      });
    } catch (e) {
      res.status(500).send({
        errMsg: JSON.stringify(e),
      });
      throw e;
    }
  }
}
