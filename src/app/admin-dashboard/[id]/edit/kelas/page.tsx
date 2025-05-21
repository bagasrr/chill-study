"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FormTextField } from "@/components/FormTextField";

type FormValues = {
  title: string;
  thumbnail: string;
  deskripsi: string;
};

export default function EditKelas() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  const thumbnailURL = watch("thumbnail");

  useEffect(() => {
    if (id) {
      fetchKelas();
    }
  }, [id]);

  const fetchKelas = async () => {
    try {
      const res = await axios.get(`/api/${id}/details/kelas`);
      reset(res.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await axios.patch(`/api/${id}/edit/kelas`, data);
      toast.success("Kelas berhasil Diupdate 🎉");
      setLoading(false);
      setTimeout(() => {
        router.push("/admin-dashboard#kelas");
      }, 1500);
    } catch (err: AxiosError | any) {
      toast.error(`Gagal update kelas. Err Code : ${err?.response?.status}`);
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-5">
      <div className=" text-2xl max-w-[80%] mx-auto shadow-md bg-slate-100 p-6 rounded-lg ">
        <h1 className="font-bold text-center mb-6">Edit Kelas</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField label="Judul Kelas" name="title" register={register} />
          <InputField label="Kode Kelas" name="CompanyCode" register={register} />
          <div className="flex items-center w-full">
            <div className="flex flex-col mb-4 w-full">
              <label htmlFor="thumbnail" className="text-sm font-medium text-gray-700">
                Thumbnail
              </label>
              <input type="text" {...register("thumbnail")} placeholder={loading ? "Mengambil data" : "https://example.com/thumb.jpg"} className="w-[90%] p-3 rounded-md text-sm" />
            </div>

            {thumbnailURL && (
              <div>
                <Image src={thumbnailURL} width={100} height={100} alt="Preview Thumbnail" className="rounded-lg object-cover" />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="deskripsi" className="text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea {...register("deskripsi")} className="w-full h-40 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <button type="submit" disabled={loading || isSubmitting} className="w-1/3 py-2 border border-sky-400 text-sky-600 rounded-lg hover:bg-sky-100 transition">
            {loading || isSubmitting ? "Updating..." : "Update Kelas"}
          </button>
        </form>
      </div>
    </div>
  );
}
