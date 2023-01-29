import useSWR from "swr";

const fetcher = (path) => fetch(path).then((res) => res.json());

export default function useBanner() {
  const { data, error } = useSWR("/api/banner", fetcher);
  return {
    banners: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
