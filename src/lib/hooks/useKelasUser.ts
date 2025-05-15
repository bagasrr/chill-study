import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useKelasUser(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(`/api/kelas-user/${userId}`, fetcher);

  return {
    kelasUser: data,
    isLoading,
    error,
    mutate,
  };
}
