import StaticPage from "../../modules/content";
import dayjs from "dayjs";
import { encrypt } from "lib/crypto";

export default function ServerSidePage({ data, keyOfPage, myt }) {
  return <StaticPage {...{ data, keyOfPage, myt }} />;
}

export async function getServerSideProps({ req, params }) {
  const keyOfPage = mappingKeys(params.key);
  const fetchingData = await fetch(
    process.env.NEXT_PUBLIC_BE_URI + "/api/settings?key=" + keyOfPage
  );
  const res = fetchingData.ok && (await fetchingData.json());
  const text = res?.data?.value || "no data available";

  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const myt = encrypt(ip + "@@@" + dayjs().format("YYYY-MM-DDTHH:mm:sss"));

  return {
    props: {
      data: text,
      keyOfPage,
      myt,
    },
  };
}

function mappingKeys(name) {
  let key = "";
  switch (name) {
    case "kebijakan-privasi":
      key = "pp";
      break;
    case "ketentuan-kondisi":
      key = "tnc";
      break;
    case "contact-us":
      key = "contact";
      break;
    default:
      key = "about";
      break;
  }
  return key;
}
