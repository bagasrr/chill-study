import { patrickHand } from "@/ui/fonts";
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0F0F0F",
        surface: "#1A1A1A",
        primary: "#00FFE0",
        secondary: "#FF4C29",
        textPrimary: "#EAEAEA",
        textSecondary: "#A0A0A0",
        linkHover: "#00BFA6",
        error: "#FF005C",
      },
      boxShadow: {
        neon: "0 0 12px #00FFE0",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        patrickHand: ["var(--font-patrick-hand)", "cursive"],
        notoSans: ["var(--font-noto-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
