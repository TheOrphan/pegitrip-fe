import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function useVariant(pid) {
  const { data, error } = useSWR("/api/variants?pid=" + pid, fetcher);
  return {
    variants: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
