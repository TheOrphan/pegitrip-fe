import useSWR from "swr";

const fetcher = (path) => fetch(path).then((res) => res.json());

export default function useProduct() {
  const { data, error } = useSWR("/api/product", fetcher);

  return {
    products: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProductBySlug(slug) {
  const { data, error } = useSWR("/api/product?slug=" + slug, fetcher);
  return {
    product: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
