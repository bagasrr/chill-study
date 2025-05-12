// components/PricingCard.tsx
import { PricingCardProps } from "@/lib/type";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@mui/material";

import Link from "next/link";

export const PricingCard: React.FC<PricingCardProps> = ({ title, price, description, canAccess, hasProgress, link = "" }) => {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition flex flex-col justify-around">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-col">
        <p className="text-lg font-semibold text-green-600">{price === 0 ? "Gratis" : formatCurrency(price)}</p>
        <Link href={canAccess ? link : "#"} className={`mt-3 w-fit px-4 py-2  text-white rounded-lg   ${hasProgress ? "bg-green-600 hover:bg-green-700" : canAccess ? "bg-sky-600 hover:bg-sky-700" : "bg-gray-400 cursor-not-allowed"}`}>
          {hasProgress ? "Lihat Materi" : canAccess ? "Mulai Belajar" : "Beli Kelas Sekarang"}
        </Link>
      </div>
    </div>
  );
};

export const PricingCardSkeleton: React.FC = () => {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white flex flex-col justify-around">
      {/* Title */}
      <Skeleton variant="text" width="70%" height={30} sx={{ bgcolor: "grey.300" }} />
      {/* Description */}
      <Skeleton variant="text" width="90%" height={20} className="mb-2" sx={{ bgcolor: "grey.300" }} />
      <Skeleton variant="text" width="80%" height={20} className="mb-4" sx={{ bgcolor: "grey.300" }} />
      {/* Price */}
      <Skeleton variant="text" width="40%" height={25} sx={{ bgcolor: "grey.300" }} />
      {/* Button */}
      <Skeleton variant="rectangular" width={120} height={40} className="mt-3 rounded-lg" sx={{ bgcolor: "grey.300" }} />
    </div>
  );
};
