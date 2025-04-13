// app/about/page.tsx
"use client";

import { useEffect, useState } from "react";
import LeadershipCard from "@/components/LeadershipCard";
import { Container, Typography, Box } from "@mui/material";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  const leaders = [
    {
      name: "Bagas Ramadhan Rusnadi",
      role: "Chief Executive Officer (CEO)",
      responsibility: "Mengatur arah dan strategi pengembangan platform",
      image: "/leaders/bagas.jpeg",
    },
    {
      name: "Raka Nurhuda",
      role: "Chief Technology Officer (CTO)",
      responsibility: "Mengelola arsitektur teknis dan pengembangan sistem",
      image: "/leaders/bagas.jpeg",
    },
    {
      name: "Farhan R. Maulana",
      role: "Chief Content Officer (CCO)",
      responsibility: "Bertanggung jawab atas kurikulum dan materi belajar",
      image: "/leaders/bagas.jpeg",
    },
    {
      name: "Rizky Saputra",
      role: "Head of Community & Partnership",
      responsibility: "Mengelola kerja sama, relasi, dan komunitas pengguna",
      image: "/leaders/bagas.jpeg",
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
        <Box className="grid sm:grid-cols-2 gap-6 mt-4">
          {(loading ? Array(4).fill({}) : leaders).map((leader, index) => (
            <LeadershipCard key={index} name={leader.name} role={leader.role} responsibility={leader.responsibility} image={leader.image} loading={loading} />
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
