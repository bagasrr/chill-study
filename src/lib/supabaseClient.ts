"use client";
import { createClient } from "@supabase/supabase-js";

export const Supabase = (accessToken?: string) => {
  // Menerima accessToken sebagai parameter opsional
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Menggunakan accessToken yang diterima
      },
    },
  });
  return supabase;
};
