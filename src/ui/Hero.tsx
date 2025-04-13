import { Button, Typography } from "@mui/material";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="flex items-center gap-5">
      <div className="p-5 w-1/2 flex flex-col gap-5">
        <Typography variant="h4">Ini Waktumu Bersinar. Kuasai Keahlian, Tunjukkan Kemampuan!</Typography>
        <Typography variant="subtitle1">Dirancang khusus buat kamu yang pengen jadi yang terbaik di bidang TKJ, TKR, dan lainnya.</Typography>
        <Button variant="outlined" color="success" className="mt-5 text-black">
          Mulai Sekarang
        </Button>
      </div>
      <div className="">
        <Image src="/hero.png" alt="Hero" width={768} height={512} />
      </div>
    </div>
  );
}
