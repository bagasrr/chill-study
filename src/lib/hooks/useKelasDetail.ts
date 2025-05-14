// lib/hooks/useKelasDetail.ts
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useKelasDetail(kelasnama: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(kelasnama ? `/api/kelas/${kelasnama}` : null, fetcher);

  return {
    kelas: data,
    isLoading,
    error,
    mutate,
  };
}
