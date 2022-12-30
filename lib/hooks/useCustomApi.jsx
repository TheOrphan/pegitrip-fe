import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export function useCheckRoleApi(id) {
  const { data, error } = useSWR("/api/product_api_checks?pid=" + id, fetcher);
  return {
    checkRoleAPI: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
