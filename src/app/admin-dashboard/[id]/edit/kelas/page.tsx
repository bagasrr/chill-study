"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form"; // 1. Import Controller
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BackSubmitButton from "@/components/BackSubmitButton";
import Select from "react-select";
import { useFetchData } from "@/lib/hooks/useFetchData"; // Pastikan path ini benar
import InputField from "@/components/InputField";

// 2. Update tipe form, tambahkan CompanyCode dan certifTemplateId
type FormValues = {
  title: string;
  thumbnail: string;
  deskripsi: string;
  CompanyCode: string;
  certifTemplateId: string;
};

// Fungsi untuk merender opsi dengan gambar
const formatOptionLabel = ({ label, image }: { label: string; image: string }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Image src={image} alt={label} style={{ width: 50, height: "auto", marginRight: 10, borderRadius: "4px" }} />
    <span>{label}</span>
  </div>
);

export default function EditKelas() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 3. Fetch data template sertifikat
  const { data: certifTemplate } = useFetchData("/api/certificate/template") as { data: { id: string; name: string; certifTemplate: string }[] };
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control, // Ambil 'control' dari useForm
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      thumbnail: "",
      deskripsi: "",
      CompanyCode: "",
      certifTemplateId: "",
    },
  });

  const thumbnailURL = watch("thumbnail");

  useEffect(() => {
    if (id) {
      const fetchKelas = async () => {
        try {
          const res = await axios.get(`/api/${id}/details/kelas`); // Pastikan endpoint API benar
          reset(res.data); // reset akan mengisi semua field termasuk certifTemplateId
        } catch (err) {
          toast.error("Gagal mengambil data kelas.");
          console.error("Failed to fetch data:", err);
        }
      };
      fetchKelas();
    }
  }, [id, reset]);

  // 4. Siapkan options untuk react-select
  const certificateOptions =
    certifTemplate?.map((template) => ({
      value: template.id,
      label: template.name,
      image: template.certifTemplate,
    })) || [];

  // onSubmit sekarang akan menerima data lengkap dari react-hook-form
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      console.log(data);
      await axios.patch(`/api//${id}/edit/kelas`, data); // Pastikan endpoint API benar
      toast.success("Kelas berhasil Diupdate 🎉");
      setLoading(false);
      // setTimeout(() => {
      router.push("/admin-dashboard#kelas");
      // }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err?.response?.data?.message || err.message);
        setLoading(false);
      }
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="w-screen mx-auto py-12 px-6 bg-slate-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="font-bold text-center text-3xl mb-6">Edit Kelas</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField label="Judul Kelas" name="title" register={register} />
          <InputField label="Kode Kelas" name="CompanyCode" register={register} />

          <div className="flex items-center  w-full space-x-4">
            <div className="w-full ">
              <InputField label="Thumbnail URL" name="thumbnail" register={register} />
            </div>

            {thumbnailURL && (
              <div>
                <Image src={thumbnailURL} width={200} height={200} alt="Preview Thumbnail" className="rounded-lg object-cover" />
              </div>
            )}
          </div>

          {/* 5. Gunakan Controller untuk membungkus komponen Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Sertifikat</label>
            <Controller
              name="certifTemplateId"
              control={control}
              rules={{ required: "Template sertifikat wajib dipilih" }}
              render={({ field }) => (
                <Select
                  {...field}
                  instanceId="certifTemplate-select-edit"
                  options={certificateOptions}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Pilih Template Sertifikat..."
                  noOptionsMessage={() => "Template tidak ditemukan"}
                  value={certificateOptions.find((c) => c.value === field.value)}
                  onChange={(option) => field.onChange(option?.value)}
                  styles={{
                    control: (base) => ({ ...base, backgroundColor: "#f1f5f9", padding: "0.25rem" }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              )}
            />
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea {...register("deskripsi")} className="w-full h-40 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mt-8">
            <BackSubmitButton submit={loading || isSubmitting ? "Updating..." : "Update Kelas"} disable={loading || isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
}
