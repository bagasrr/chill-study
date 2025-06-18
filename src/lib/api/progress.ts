// File: lib/api/progress.ts

import axios from "axios";

/**
 * Menyimpan progress untuk item konten spesifik (video atau PDF).
 * API ini akan menandai item sebagai 'dilihat' atau 'dimulai'.
 * @param materiContentId - ID dari item di dalam tabel MateriContent.
 */
export const saveProgress = async (materiContentId: string) => {
  // Kita akan menggunakan endpoint yang sudah benar logikanya.
  // Kita ubah namanya agar lebih konsisten.
  return axios.post("/api/progress", { materiContentId });
};

/**
 * Menyelesaikan progress untuk sebuah item konten (misal: video selesai ditonton).
 * Sebenarnya, API ini bisa digabung dengan saveProgress jika logikanya sama.
 * Untuk sekarang, kita buat berbeda agar jelas.
 * @param materiContentId - ID dari item di dalam tabel MateriContent.
 */
export const completeProgress = async (materiContentId: string) => {
  // Kita akan menggunakan endpoint yang sama, tapi mungkin dengan payload berbeda di masa depan.
  // Untuk saat ini, kita bisa gabungkan. Mari kita sederhanakan.
  // Cukup gunakan saveProgress untuk semua kasus.
  // Jika Anda butuh logika "complete" yang berbeda, kita bisa buat API terpisah.
  // Untuk sekarang, kita asumsikan saveProgress sudah cukup.
  // completeProgress bisa menjadi alias dari saveProgress jika perlu.
  return saveProgress(materiContentId);
};
