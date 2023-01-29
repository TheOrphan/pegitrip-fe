import Page from "../modules/payment";

function Home({ transactionDetail }) {
  return <Page {...{ transactionDetail }} />;
}

// This gets called on every request
export async function getServerSideProps({ query }) {
  // const { order_id, status_code, transaction_status, trxId } = query;
  // const transaction = await prisma.transactions.findFirst({
  //   where: {
  //     invoice_number: order_id || trxId,
  //   },
  // });
  // if (
  //   order_id &&
  //   parseInt(status_code) === 200 &&
  //   transaction_status === "capture"
  // ) {
  //   const updateTrx = await prisma.transactions.update({
  //     where: {
  //       id: transaction.id,
  //     },
  //     data: {
  //       status: 1,
  //     },
  //   });
  //   if (updateTrx) {
  //     return {
  //       redirect: {
  //         permanent: false,
  //         destination: `/payment?trxId=${order_id}`,
  //       },
  //     };
  //   }
  // }
  // const variantRes = await fetch(
  //   `${process.env.NEXT_PUBLIC_BE_URI}/api/variants?varId=${transaction.variant_id}`
  // );
  // const variant = await variantRes.json();
  // const prodRes = await fetch(
  //   `${process.env.NEXT_PUBLIC_BE_URI}/api/products?pid=${variant.data.product_id}`
  // );
  // const product = await prodRes.json();
  // const { created_at, updated_at, ...trxDetail } = transaction;
  // const transactionDetail = {
  //   transaction: trxDetail,
  //   variant: variant.data.variant_name,
  //   product: product.data,
  // };
  return { props: { transactionDetail: {} } };
}

export default Home;
