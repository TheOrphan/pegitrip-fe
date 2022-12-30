import useSWR from "swr";

const fetcher = (path) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + path).then((res) => res.json());

export default function usePaymentMethodC() {
  const { data, error } = useSWR("/api/payment_method_categories", fetcher);
  return {
    paymentMethodC: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
}
