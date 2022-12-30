import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function useProduct() {
  const { data, error } = useSWR("/api/products", fetcher);

  return {
    products: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProductBySlug(slug) {
  const { data, error } = useSWR("/api/products?slug=" + slug, fetcher);
  return {
    product: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
