import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useKelasProgress = (kelasId: string) => {
  const { data, error, isLoading } = useSWR(`/api/materi/${kelasId}/progress`, fetcher);

  return {
    total: data?.totalMateri || 0,
    selesai: data?.selesai || 0,
    percent: data?.progressPercent || 0,
    isLoading,
    isError: error,
  };
};
