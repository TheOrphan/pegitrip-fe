// import { Prisma } from "@prisma/client";
// import { prisma } from "../../../lib/prismadb";
import { decrypt } from "lib/crypto";
import * as dayjs from "dayjs";
import rateLimit from "lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(req, res) {
  try {
    await limiter.check(res, 2, "CACHE_TOKEN"); // 2 requests per minute
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
  if (req.method === "POST") {
    // Process a POST request
    const { captcha, myt, ...rest } = req.body;
    if (!myt) {
      res.status(500).send({
        msg: "Unauthorized access",
      });
    } else {
      const forwarded = req.headers["x-forwarded-for"];
      const ip = forwarded
        ? forwarded.split(/, /)[0]
        : req.connection.remoteAddress;
      const deMyt = decrypt(myt).split("@@@");
      const ipFrom = deMyt[0];
      const dateNow = dayjs();
      const dateMyt = dayjs(deMyt[1]).format("YYYY-MM-DDTHH:mm:sss");
      const diffTime = dateNow.diff(dateMyt, "minute");
      if (ipFrom !== ip || diffTime > 3) {
        res.status(500).send({
          msg: "Unauthorized access",
        });
      } else if (!captcha) {
        res.status(500).send({
          msg: "Your captcha failed. Please try to refresh the page and resend your messages.",
        });
      } else {
        try {
          // const message = await prisma.inboxes.create({
          //   data: {
          //     ...rest,
          //     status: 0,
          //     created_at: dayjs().add(7, "hour").toISOString(),
          //     updated_at: dayjs().add(7, "hour").toISOString(),
          //   },
          // });
          // if (message) {
          res.status(200).send({ msg: "message sent successfully." });
          // }
        } catch (e) {
          // if (e instanceof Prisma.PrismaClientKnownRequestError) {
          //   res.status(500).send({
          //     errCode: e.code,
          //     errMsg: e.message,
          //     errTarget: e.meta,
          //   });
          // }
          throw e;
        }
      }
    }
  }
}
