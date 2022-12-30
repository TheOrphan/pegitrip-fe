import Page from "../modules/home";

function Home({ datalist, socialMedias }) {
  return <Page {...{ datalist, socialMedias }} />;
}

// This gets called on every request
export async function getServerSideProps({ query }) {
  const catRes = await fetch(
    `${process.env.NEXT_PUBLIC_BE_URI}/api/categories`
  );
  const categories = await catRes.json();
  const prodRes = await fetch(
    `${process.env.NEXT_PUBLIC_BE_URI}/api/products${
      query.search ? "?search=" + query.search : ""
    }`
  );
  const products = await prodRes.json();

  let prodCat = [];
  if (!query.search) {
    if (categories.status === 200 && products.status === 200) {
      let catCounter = 0;
      categories?.data.map((category) => {
        const isPrdCat = products?.data.filter(
          (e) => e.category_id === category.id
        );
        if (isPrdCat.length > 0) {
          prodCat[catCounter] = { name: category.name, products: [] };
          products?.data.map((product) => {
            if (product.category_id === category.id) {
              prodCat[catCounter]["products"].push(product);
            }
          });
          catCounter++;
        }
      });
    }
  } else {
    const resetCard = {
      key: "0",
      name: "Back to all games",
      slug: "/",
      value: "/",
      thumbnail: "go-back",
    };
    prodCat.push({
      name: `${products?.data.length < 1 ? "Not found G" : "G"}ame with '${
        query.search
      }'`,
      products: [resetCard, ...products?.data],
    });
  }

  // social-media-related
  const fetchingData = await fetch(
    process.env.NEXT_PUBLIC_BE_URI + "/api/settings?key=social-media"
  );
  const res = fetchingData.ok && (await fetchingData.json());
  const socialMedias = res?.data || "no social media";
  return { props: { datalist: prodCat, socialMedias } };
}

export default Home;
