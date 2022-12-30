import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function useCategory() {
  const { data, error } = useSWR("/api/categories", fetcher);
  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
  };
}
