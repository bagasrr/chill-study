// Pastikan nama file adalah useFetchData.ts atau useFetchData.tsx
"use client";
import { useEffect, useState, useCallback } from "react"; // Tambahkan useCallback
import axios from "@/lib/axios"; // auto import setelah setup instance
import { AxiosError, isAxiosError } from "axios";

export function useFetchData<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Buat fungsi fetcher utama
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error saat mencoba fetch ulang
    try {
      const res = await axios.get<T>(url);
      setData(res.data);
    } catch (err) {
      // Tangkap error dengan tipe any atau spesifik jika Anda tahu
      // Periksa apakah error adalah instance dari AxiosError
      if (isAxiosError(err)) {
        setError(err); // Simpan AxiosError
      } else {
        // Jika bukan AxiosError, mungkin ini Error generik atau lainnya
        // Kita bisa mengkonversinya ke Error standar atau biarkan sebagai unknown
        setError(new Error("An unexpected error occurred.") as AxiosError); // Konversi atau tangani sesuai kebutuhan
      }
    } finally {
      setLoading(false);
    }
  }, [url]); // Dependensi: url

  useEffect(() => {
    fetchData(); // Panggil fetchData saat komponen mount atau url berubah
  }, [fetchData]); // Dependensi: fetchData (karena useCallback memastikan stable reference)

  // Kembalikan fetchData sebagai refreshData
  return { data, loading, error, refreshData: fetchData };
}
