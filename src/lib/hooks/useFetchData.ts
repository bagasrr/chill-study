"use client";
import { useEffect, useState } from "react";
import axios from "@/lib/axios"; // auto import setelah setup instance

export function useFetchData<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    axios
      .get<T>(url)
      .then((res: any) => {
        if (isMounted) setData(res.data);
      })
      .catch((err: any) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);
  return { data, loading, error };
}
