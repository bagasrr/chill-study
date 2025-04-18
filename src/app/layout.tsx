import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { notoSans, patrickHand, poppins, roboto } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Chill Study",
  description: "Generated by create next app",
  icons: {
    icon: "./logo_navbar.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}  ${roboto.variable}  ${patrickHand.variable} ${notoSans.variable} antialiased text-black dark:text-white`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
