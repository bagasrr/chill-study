// lib/hooks/useKelasDetail.ts
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useKelasDetail(kelasnama: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(kelasnama ? `/api/kelas/kelas-detail/${kelasnama}` : null, fetcher);

  return {
    kelas: data,
    isLoading,
    error,
    mutate,
  };
}

export function useKelasDetailById(kelasId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(kelasId ? `/api/${kelasId}/details/kelas` : null, fetcher);

  return {
    kelas: data,
    isLoading,
    error,
    mutate,
  };
}
