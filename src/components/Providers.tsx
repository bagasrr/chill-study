"use client";

import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import theme from "@/lib/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SessionProvider>
  );
}
