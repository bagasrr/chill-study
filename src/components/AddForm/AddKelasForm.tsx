"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Select from "react-select"; // 1. Import react-select
import { FormTextField } from "../FormTextField";
import axios from "@/lib/axios";
import { useFormSubmit } from "@/lib/hooks/useSubmitform";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import BackSubmitButton from "../BackSubmitButton";
import { useFetchData } from "@/lib/hooks/useFetchData";

// 2. Update interface, tambahkan certifTemplateId
interface KelasForm {
  title: string;
  deskripsi: string;
  thumbnail: string;
  CompanyCode: string;
  certifTemplateId: string; // ID dari template sertifikat yang dipilih
}

export default function AddKelasForm() {
  // 3. Update state awal
  const [kelas, setKelas] = useState<KelasForm>({
    title: "",
    deskripsi: "",
    thumbnail: "",
    CompanyCode: "",
    certifTemplateId: "", // State untuk menyimpan ID sertifikat
  });

  const { isLoading, submitWrapper } = useFormSubmit();
  const router = useRouter();
  const { data: certifTemplate } = useFetchData("/api/certificate/template");

  const handleChange = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => {
    setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 4. Buat handler khusus untuk react-select
  const handleCertifChange = (selectedOption: any) => {
    setKelas((prev) => ({ ...prev, certifTemplateId: selectedOption.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi sederhana untuk memastikan template dipilih
    if (!kelas.certifTemplateId) {
      toast.error("Silakan pilih template sertifikat terlebih dahulu.");
      return;
    }
    console.log(kelas);
    submitWrapper(async () => {
      try {
        await axios.post("/api/kelas", kelas);
        router.push("/admin-dashboard#kelas");
        toast.success("Kelas berhasil ditambahkan 🎉");
      } catch (error) {
        toast.error("Gagal menambahkan kelas 😢");
        console.error(error);
      }
    });
  };

  // 5. Siapkan data untuk react-select
  const certificateOptions = certifTemplate?.map((template: any) => ({
    value: template.id,
    label: template.name,
    image: template.certifTemplate, // URL gambar
  }));

  // 6. Komponen untuk menampilkan opsi dengan gambar
  const formatOptionLabel = ({ label, image }: { label: string; image: string }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img src={image} alt={label} style={{ width: 50, height: "auto", marginRight: 10, borderRadius: "4px" }} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="w-screen mx-auto py-12 px-6 bg-slate-200">
      <div className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl font-roboto font-bold mb-5 text-center">Tambah Kelas Baru</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-sky-400 mb-4">Informasi Kelas</h2>
            </div>
            <div className="col-span-2">
              <FormTextField label="Judul Kelas" name="title" value={kelas.title} onChange={handleChange(setKelas)} required />
            </div>

            <FormTextField label="Thumbnail URL" name="thumbnail" value={kelas.thumbnail} onChange={handleChange(setKelas)} />
            <FormTextField label="Kode Kelas" name="CompanyCode" value={kelas.CompanyCode} onChange={handleChange(setKelas)} />

            {/* 7. Ganti <select> dengan komponen Select dari react-select */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Sertifikat</label>
              <Select
                instanceId="certifTemplate-select" // ID unik untuk SSR
                options={certificateOptions}
                formatOptionLabel={formatOptionLabel}
                onChange={handleCertifChange}
                placeholder="Pilih Template Sertifikat..."
                noOptionsMessage={() => "Template tidak ditemukan"}
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#f1f5f9", // bg-slate-100
                    padding: "0.25rem",
                    borderColor: "#e2e8f0", // default border
                    "&:hover": {
                      borderColor: "#cbd5e1",
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#e2e8f0" : "white",
                    color: "black",
                  }),
                  menu: (base) => ({
                    ...base,
                    // Atur z-index di sini
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            <div className="col-span-2">
              <FormTextField label="Deskripsi Kelas" name="deskripsi" value={kelas.deskripsi} onChange={handleChange(setKelas)} multiline rows={4} />
            </div>
          </div>

          <div className="mt-8 relative">
            <BackSubmitButton submit="Tambah Kelas" disable={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
}
