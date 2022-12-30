import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function useProductForm(pid) {
  const { data, error } = useSWR(
    "/api/product_required_forms?pid=" + pid,
    fetcher
  );
  return {
    forms: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
