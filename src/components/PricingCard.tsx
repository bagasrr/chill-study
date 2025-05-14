"use client";

import { PricingCardProps } from "@/lib/type";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export const PricingCard: React.FC<PricingCardProps> = ({ id, title, price, content, canAccess, hasProgress, link = "", onRefresh }) => {
  const { data: session } = useSession();

  const handleBayar = async () => {
    try {
      // 1. Buat orderId di sini
      const orderId = `ORDER-${Date.now()}-${id}`;

      // 2. Simpan payment dulu ke DB
      await axios.post("/api/payment/confirm", {
        orderId,
        materiId: id,
        price,
      });

      // 3. Baru create transaksi ke Midtrans
      const res = await axios.post("/api/payment/checkout", {
        orderId, // Kirim orderId manual
        kelasId: id,
        kelasName: title,
        price,
        userEmail: session?.user?.email,
        userName: session?.user?.name,
        userId: session?.user?.id,
      });

      const snapToken = res.data.token;

      window.snap.pay(snapToken, {
        onSuccess: async function () {
          toast.success("Pembayaran berhasil! 🎉");
          console.log("🔥 Triggering mutate...");
          onRefresh?.(); // ini harusnya trigger mutate
          console.log("✅ Mutate dipanggil");
        },
        onPending: function (result) {
          console.log("⏳ Pending", result);
        },
        onError: function (result) {
          console.log("❌ Error", result);
        },
        onClose: function () {
          console.log("❌ User closed the popup without finishing the payment");
        },
      });
    } catch (err) {
      console.error("❌ Error bayar:", err);
    }
  };

  return (
    <div className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition flex flex-col justify-around">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{content}</p>
      <div className="flex flex-col">
        {!canAccess && <p className="text-lg font-semibold text-green-600">{price === 0 ? "Gratis" : formatCurrency(price)}</p>}

        {canAccess ? (
          <Link href={link} className={`mt-3 w-fit px-4 py-2 text-white rounded-lg ${hasProgress ? "bg-green-600 hover:bg-green-700" : "bg-sky-600 hover:bg-sky-700"}`}>
            {hasProgress ? "Lihat Materi" : "Mulai Belajar"}
          </Link>
        ) : (
          <button onClick={handleBayar} className="mt-3 w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Beli Kelas Sekarang
          </button>
        )}
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
