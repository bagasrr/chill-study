import { supabase } from "@/lib/supabaseClient";

export async function uploadTempFile(file: File, userId: string): Promise<string> {
  const filename = `${Date.now()}_${file.name}`;
  const path = `temp/${userId}/${filename}`;

  const { error } = await supabase.storage.from("questions").upload(path, file);
  if (error) throw new Error("Upload ke Supabase gagal");

  await fetch("/api/upload-temp", {
    method: "POST",
    body: JSON.stringify({ userId, path }),
    headers: { "Content-Type": "application/json" },
  });

  return path;
}
