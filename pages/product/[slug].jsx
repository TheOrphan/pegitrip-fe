import { useRouter } from "next/router";
import Product from "../../modules/product";
import { encrypt } from "lib/crypto";
import * as dayjs from "dayjs";

function Products({ myt, qParams }) {
  const { query } = useRouter();
  return <Product slug={query.slug} {...{ myt, qParams }} />;
}
export async function getServerSideProps({ req, params }) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
  const myt = encrypt(ip + "@@@" + dayjs().format("YYYY-MM-DDTHH:mm:sss"));
  return { props: { myt, qParams: params } };
}

export default Products;
