import * as sliderCaptcha from "@slider-captcha/core";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.method === "POST") {
      // Process a POST request
      const verification = await sliderCaptcha.verify(
        req.session.captcha,
        req.body
      );
      if (verification.result === "success") {
        req.session.token = verification.token;
        await req.session.save();
      }
      res.status(200).send(verification);
    } else if (req.method === "GET") {
      // Handle any other HTTP method
      const { data, solution } = await sliderCaptcha.create({
        distort: true,
        rotate: true,
      });
      req.session.captcha = solution;
      await req.session.save();
      res.status(200).send(data);
    }
  },
  {
    cookieName: "_c",
    password: "LbDMQ6YnCdfnsNgVX3KDiBRMcGX8zpUm",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      //   secure: process.env.NODE_ENV === "production",
      secure: false,
    },
  }
);
