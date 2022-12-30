import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function useBanner() {
  const { data, error } = useSWR("/api/contents?type=banner", fetcher);
  return {
    banners: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
