import * as bcrypt from "bcrypt";
// import { Prisma } from "@prisma/client";
// import { prisma } from "../../../lib/prismadb";
import { decrypt } from "lib/crypto";
import * as dayjs from "dayjs";
import rateLimit from "lib/rate-limit";
import sendRegistrationEmail from "../email/registration";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(req, res) {
  try {
    await limiter.check(res, 10, "CACHE_TOKEN"); // 10 requests per minute
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
  if (req.method === "POST") {
    // Process a POST request
    const { password, captcha, terms, myt, ...rest } = req.body;
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
      } else if (!captcha || !terms) {
        res.status(500).send({
          msg: "Either your captcha failed or you forgot to check our terms.",
        });
      } else {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          // const user = await prisma.user.create({
          //   data: {
          //     ...rest,
          //     password: hashedPassword,
          //   },
          // });
          // if (user) {
          //   res.status(200).send({ msg: "user registered successfully." });
          // }
          sendRegistrationEmail(user, req);
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
