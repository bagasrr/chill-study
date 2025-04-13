import { Noto_Sans, Patrick_Hand, Roboto } from "next/font/google";
import { Poppins } from "next/font/google";

export const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-roboto",
});
export const notoSans = Noto_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
});
export const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-hand",
});
