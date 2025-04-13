import { Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center gap-5 px-[5%]">
      <div className="p-5 w-full lg:w-1/2 flex flex-col gap-5">
        <Typography variant="h4">Ini Waktumu Bersinar. Kuasai Keahlian, Tunjukkan Kemampuan!</Typography>
        <Typography variant="subtitle1">Dirancang khusus buat kamu yang pengen jadi yang terbaik di bidang TKJ, TKR, dan lainnya.</Typography>
        <Button variant="contained" color="success">
          <Link href="/learning">Mulai Sekarang</Link>
        </Button>
      </div>
      <div>
        <Image src="/hero.png" alt="Hero" width={768} height={512} />
      </div>
    </div>
  );
}
