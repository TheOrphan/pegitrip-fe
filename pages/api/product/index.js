import pbAuth from "../auth/pb";
import getBase64FromUrl from "../../../lib/getBase64FromUrl";
import rateLimit from "lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function getProduct(req, res) {
  try {
    await limiter.check(res, 20, "CACHE_TOKEN"); // 2 requests per minute
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
  if (req.method === "GET") {
    // Process a GET request
    const { search } = req.query;
    try {
      const pb = await pbAuth();
      const productRecords = await pb.collection("products").getFullList(10, {
        filter: `status = true ${search ? '&& search ~ "' + search + '"' : ""}`,
        expand: "category_id,tags_id,location_id",
      });
      const products = [];
      for (
        let productIdx = 0;
        productIdx < productRecords.length;
        productIdx++
      ) {
        const product = productRecords[productIdx];
        const packageRecords = await pb.collection("packages").getFullList(10, {
          filter: `status = true && product_id = "${product.id}"`,
        });
        const prices = packageRecords.map((p) => p.price);
        const lowest = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumSignificantDigits: 3,
        }).format(Math.min(...prices));
        const highest = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumSignificantDigits: 3,
        }).format(Math.max(...prices));
        const thumbs = [];
        for (
          let thumbnailIdx = 0;
          thumbnailIdx < product.thumbnails.length;
          thumbnailIdx++
        ) {
          thumbs[thumbnailIdx] = await getBase64FromUrl(
            `${process.env.NEXT_PUBLIC_BE_URI}/api/files/products/${product.id}/${product.thumbnails[thumbnailIdx]}`
          );
        }
        products[productIdx] = {
          ...product,
          thumbnails: thumbs,
          price: `${lowest} ~ ${highest}`,
        };
      }
      pb.authStore.clear();
      res.status(200).send({
        data: products,
      });
    } catch (e) {
      res.status(500).send({
        errMsg: JSON.stringify(e),
      });
      throw e;
    }
  }
}
