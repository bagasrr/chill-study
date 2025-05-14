import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useAllKelas() {
  const { data, error, isLoading, mutate } = useSWR("/api/kelas", fetcher);

  return {
    kelas: data,
    isLoading,
    error,
    mutate,
  };
}
