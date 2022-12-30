import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function useSetting(key) {
  const { data, error } = useSWR("/api/settings?key=" + key, fetcher);
  return {
    settings: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
