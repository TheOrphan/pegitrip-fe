import Page from "../modules/home";

function Home({ socialMedias }) {
  return <Page {...{ socialMedias }} />;
}

// This gets called on every request
export async function getServerSideProps() {
  return { props: { socialMedias: "no social media" } };
}

export default Home;
