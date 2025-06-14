// src/lib/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `'Noto Sans', sans-serif`,
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0f0f0f",
      paper: "#121212",
    },
    primary: {
      main: "#00FFBF",
    },
    secondary: {
      main: "#FF4C29",
    },
    text: {
      primary: "#EAEAEA",
      secondary: "#A0A0A0",
    },
  },
});

export default theme;

export const lightTheme = createTheme({
  palette: {
    mode: "light", // 👈 KUNCI UTAMA: Mengaktifkan mode terang
    background: {
      paper: "#ffffff", // Warna dasar untuk komponen seperti Paper dan Card
      default: "#f4f6f8", // Warna dasar untuk body
    },
    text: {
      primary: "#121212", // Warna teks utama (gelap)
      secondary: "#637381", // Warna teks sekunder
    },
  },
  components: {
    // Kustomisasi spesifik jika diperlukan
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600, // Membuat header tabel sedikit tebal
        },
      },
    },
  },
});
