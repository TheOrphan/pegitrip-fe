import SibApiV3Sdk from "sib-api-v3-sdk";

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
export default function sendInvoiceEmail(email, invoice, req) {
  sendSmtpEmail.templateId = 3;
  sendSmtpEmail.to = [{ email: email, name: "email.name" }];
  sendSmtpEmail.replyTo = {
    email: "replyto@domain.com",
    name: "Bakul Voucher Game",
  };
  sendSmtpEmail.params = {
    ...invoice,
    host: req.headers.host,
  };
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
}
