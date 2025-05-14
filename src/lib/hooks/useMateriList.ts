import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useMateriList(kelasId: string) {
  const { data, error, isLoading, mutate } = useSWR(`/api/materi/${kelasId}/materi-user`, fetcher);

  return {
    materiList: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
