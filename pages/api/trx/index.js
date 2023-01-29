// import { Prisma } from "@prisma/client";
// import { prisma } from "../../../lib/prismadb";
import { decrypt } from "lib/crypto";
import * as dayjs from "dayjs";
import rateLimit from "lib/rate-limit";
import sendInvoiceEmail from "../email/invoice";

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
    const decryptedBody = JSON.parse(decrypt(req.body.data));
    const { captcha, myt, ...rest } = decryptedBody;
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
      const diffTime = dateNow.diff(dateMyt, "hour");
      if (ipFrom !== ip || diffTime > 24) {
        res.status(500).send({
          msg: "Unauthorized access",
        });
      } else if (!captcha) {
        res.status(500).send({
          msg: "Your captcha failed. Please try to refresh the page and resend your messages.",
        });
      } else {
        try {
          const dataMidtrans = {
            transaction_details: {
              order_id: rest.invoice_number,
              gross_amount: rest.total_price,
            },
            credit_card: {
              secure: true,
            },
            customer_details: {
              first_name: rest.email,
              email: rest.email,
              phone: rest.phone,
            },
          };

          const midtransResponse = await fetch(
            "https://app.sandbox.midtrans.com/snap/v1/transactions",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  "Basic " +
                  Buffer.from(
                    process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY + ":"
                  ).toString("base64"),
              },
              body: JSON.stringify(dataMidtrans),
            }
          );
          const content = await midtransResponse.json();
          // const message = await prisma.transactions.create({
          //   data: {
          //     variant_id: parseInt(rest.variant_id),
          //     // payment_fee_id: parseInt(rest.payment_fee_id || 0),
          //     payment_fee_id: null,
          //     user_id: rest.user_id,
          //     phone: rest.phone,
          //     invoice_number: rest.invoice_number,
          //     total_price: rest.total_price,
          //     uid_game: rest.uid_game,
          //     status: 0,
          //     snap_token: content.token,
          //     created_at: dayjs().add(7, "hour").toISOString(),
          //     updated_at: dayjs().add(7, "hour").toISOString(),
          //   },
          // });
          if (message) {
            const invoice = {
              number: rest.invoice_number,
              created: rest.created_at,
              expired: rest.emailInvoice.expired,
              status: rest.emailInvoice.status,
              wording: rest.emailInvoice.wording,
              product: rest.emailInvoice.dataOrder.product,
              variant: rest.emailInvoice.dataOrder.variant.split(";")[0],
              uid: rest.emailInvoice.uid_invoice,
              method:
                rest?.emailInvoice?.dataOrder?.paymentMethod?.split(";")[0] ||
                null,
              seller: "0112131931 A/N BAPAK PENJUAL",
              total: new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: 3,
              }).format(rest.total_price),
            };
            res.status(200).send({
              msg: "invoice sent successfully.",
              content,
            });
            sendInvoiceEmail(rest.email, invoice, req);
          }
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
