// app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import LeadershipCard from "@/components/LeadershipCard";
import { Container, Typography, Box } from "@mui/material";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  const leaders = [
    {
      name: "BAGAS RAMADHAN RUSNADI",
      role: "Anggota",
      responsibility: "Mengatur arah dan strategi pengembangan platform",
      image: "https://ecampus.pelitabangsa.ac.id/pb/f/pb/81704/PP_Ecampus.png",
    },
    {
      name: "ENDANG PUTRI LESTARI ",
      role: "Anggota",
      responsibility: "Membuat Design UI/UX",
      image: "https://ecampus.pelitabangsa.ac.id/pb/f/pb/90606/34C37105-1742-4F74-A457-CD5A6E74CFCD.jpeg",
    },
    {
      name: "MUHAMMAD DIMAS PRATAMA",
      role: "Anggota",
      responsibility: "Bertanggung jawab atas Laporan",
      image: "https://ecampus.pelitabangsa.ac.id/pb/f/pb/108092/Gambar_WhatsApp_2023-12-11_pukul_19.29.55_5b20690a.jpg",
    },
    {
      name: "AGUNG CATUR LAKSONO",
      role: "Anggota",
      responsibility: "Bertanggung jawab atas Laporan",
      image: "https://ecampus.pelitabangsa.ac.id/pb/f/pb/103790/20230916_142313.jpg",
    },
    {
      name: "ALIFARIK WIN LABIBAH ",
      role: "Anggota",
      responsibility: "Bertanggung jawab atas Koordinasi ",
      image: "https://ecampus.pelitabangsa.ac.id/pb/f/pb/101048/1692440258458.jpg",
    },
    {
      name: "MUHAMMAD FIKRI RAMADHAN",
      role: "Anggota",
      responsibility: "Bertanggung jawab atas Laporan",
      image: "https://ecampus.pelitabangsa.ac.id/pb/f/pb/109567/IMG_20230913_120459.jpg",
    },
    {
      name: "DESTRIAN MUHAMMAD RAMDANI",
      role: "Anggota",
      responsibility: "Bertanggung jawab atas Laporan",
      image: "https://ecampus.pelitabangsa.ac.id/pb/f/pb/104529/922F4000-C425-472E-9E24-7CCF0849C5D0.jpeg",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // simulasi loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      sx={{
        py: 8,
        color: "#fff",
        background: "linear-gradient(to bottom right, #0d0d0d, #1a1a2e)",
        borderRadius: 2,
      }}
    >
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Tentang Chill Study
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", mt: 2 }}>
          Chill Study adalah platform pembelajaran daring yang dirancang secara menyenangkan dan interaktif untuk menjembatani pelajar SMK dengan dunia kerja modern.
        </Typography>
      </Box>

      <Box mb={6}>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Visi
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)" }}>
          Menjadi platform pembelajaran digital yang menyenangkan, interaktif, dan mampu mencetak generasi muda siap kerja di era industri 4.0.
        </Typography>
      </Box>

      <Box mb={6}>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Misi
        </Typography>
        <ul className="list-disc pl-6 space-y-2 text-white/90">
          <li>Menyediakan konten pembelajaran yang relevan dan praktis sesuai jurusan SMK.</li>
          <li>Mempermudah akses belajar kapan saja dan di mana saja melalui platform berbasis web.</li>
          <li>Menyediakan fitur monitoring dan evaluasi untuk mendukung kemajuan belajar siswa.</li>
          <li>Menjalin kemitraan dengan industri dan tenaga profesional sebagai mentor dan pengajar.</li>
        </ul>
      </Box>

      <Box mb={10}>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Keanggotaan Pimpinan
        </Typography>
        <Box className="flex flex-wrap gap-6 mt-4">
          {(loading ? Array(4).fill({}) : leaders).map((leader, index) => (
            <LeadershipCard key={index} name={leader.name} role={leader.role} responsibility={leader.responsibility} image={leader.image} />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          Lokasi Kami
        </Typography>
        <Box
          sx={{
            mt: 2,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.1)",
            height: 300,
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=..." // ganti link maps sesuai lokasi
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            style={{ border: 0 }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default AboutPage;
