import dayjs from "dayjs";
import { decrypt } from "lib/crypto";
import { EmailVerifiedImage } from "components/layout/email-verify";
import { prisma } from "../../lib/prismadb";

function Home({ message, status, user }) {
  return <EmailVerifiedImage {...{ message, status, user }} />;
}

export async function getServerSideProps({ params }) {
  let message,
    status,
    userMyt = null;
  const { token } = params;
  const deMyt = decrypt(token);
  if (!deMyt) {
    status = false;
    message = "Your verify token is wrong. Please re-verify your email.";
  } else {
    const resMyt = deMyt.split("@@@");
    const dateNow = dayjs();
    const dateMyt = dayjs(resMyt[1]).format("YYYY-MM-DDTHH:mm:sss");
    const diffTime = dateNow.diff(dateMyt, "hour");
    userMyt = JSON.parse(resMyt[0]);

    if (diffTime > 24) {
      status = false;
      message =
        "Your verify token is expired. Please refresh your token and try again.";
    } else {
      const user = await prisma.user.update({
        where: {
          email: userMyt.email,
        },
        data: {
          emailVerified: dayjs().add(7, "hour").toISOString(),
        },
      });
      status = false;
      message =
        "Something is wrong with the verification token. Please re-verify!";

      if (user) {
        message = "Your email is verified.";
        status = true;
      }
    }
  }
  return {
    props: { message, status, user: userMyt },
  };
}

export default Home;
