import dayjs from "dayjs";
import { encrypt } from "lib/crypto";
import { AuthenticationForm } from "components/layout/auth-form";
import { Container } from "@mantine/core";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

function Home({ myt, type }) {
  return (
    <Container size={500} px={0} py="md">
      <AuthenticationForm type={type} myt={myt} />
    </Container>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const session = await await unstable_getServerSession(req, res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { type } = params;
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const myt = encrypt(ip + "@@@" + dayjs().format("YYYY-MM-DDTHH:mm:sss"));

  return { props: { myt, type } };
}

export default Home;
