import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function usePaymentMethod() {
  const { data, error } = useSWR("/api/payment_fees", fetcher);
  return {
    paymentMethod: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
