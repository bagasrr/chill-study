"use client";

import { PricingCardProps } from "@/lib/type";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@mui/material";
import axios from "axios"; // <<< Tambahkan AxiosError
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Definisi interface dasar untuk objek hasil dari Midtrans Snap callback
interface MidtransResult {
  transaction_status?: string;
  order_id?: string;
  gross_amount?: string;
  payment_type?: string;
  transaction_id?: string;
  fraud_status?: string;
  status_code?: string;
  status_message?: string;
  // Tambahkan properti lain yang mungkin muncul di objek result
}

// Definisi interface untuk objek snap global dari Midtrans
declare global {
  interface Window {
    snap: {
      pay: (
        snapToken: string,
        options: {
          onSuccess?: (result: MidtransResult) => void;
          onPending?: (result: MidtransResult) => void;
          onError?: (result: MidtransResult) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export const PricingCard: React.FC<PricingCardProps> = ({ id, title, price, content, canAccess = false, hasProgress = false, link = "", onRefresh }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBayar = async () => {
    if (!session?.user?.email || !session.user.id) {
      toast.error("Anda harus login untuk melanjutkan pembayaran.");
      return;
    }

    try {
      const orderId = `ORDER-${Date.now()}-${id}`;

      await axios.post("/api/payment/confirm", {
        orderId,
        materiId: id,
        price,
      });

      const res = await axios.post("/api/payment/checkout", {
        orderId,
        kelasId: id,
        kelasName: title,
        price,
        userEmail: session.user.email,
        userName: session.user.name || "Pengguna",
        userId: session.user.id,
      });

      const snapToken = res.data.token;

      if (typeof window !== "undefined" && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async function (result: MidtransResult) {
            console.log("✅ Pembayaran Berhasil (Midtrans Result):", result);
            toast.success("Pembayaran berhasil! 🎉");
            onRefresh?.();
          },
          onPending: function (result: MidtransResult) {
            console.log("⏳ Pembayaran Pending (Midtrans Result):", result);
            toast("Pembayaran Anda sedang menunggu konfirmasi.", { icon: "⏳" });
            onRefresh?.();
          },
          onError: function (result: MidtransResult) {
            console.log("❌ Pembayaran Error (Midtrans Result):", result);
            toast.error("Pembayaran Error! Silakan coba lagi. ❌");
            onRefresh?.();
          },
          onClose: async function () {
            console.log("❌ Pengguna menutup popup pembayaran.");
            try {
              await axios.patch("/api/payment/cancel", {
                orderId,
              });
              toast("Pembayaran dibatalkan oleh pengguna.", { icon: "❌ " });
              onRefresh?.();
            } catch (cancelError) {
              // <<< Perbaikan di sini
              // Memeriksa apakah ini AxiosError atau Error generik
              if (axios.isAxiosError(cancelError)) {
                console.error("❌ Gagal memperbarui status pembayaran ke dibatalkan (Axios Error):", cancelError.message, cancelError.response?.data);
                toast.error("Gagal memperbarui status pembayaran di sistem (Axios Error).");
              } else if (cancelError instanceof Error) {
                console.error("❌ Gagal memperbarui status pembayaran ke dibatalkan (Generic Error):", cancelError.message);
                toast.error("Gagal memperbarui status pembayaran di sistem (Error).");
              } else {
                console.error("❌ Gagal memperbarui status pembayaran ke dibatalkan (Unknown Error):", cancelError);
                toast.error("Gagal memperbarui status pembayaran di sistem (Kesalahan tak dikenal).");
              }
            }
          },
        });
      } else {
        toast.error("Midtrans Snap belum dimuat. Silakan refresh halaman.");
        console.error("Midtrans Snap is not loaded.");
      }
    } catch (err) {
      // <<< Perbaikan di sini
      if (axios.isAxiosError(err)) {
        console.error("❌ Error saat memulai proses pembayaran (Axios Error):", err.message, err.response?.data);
        const errorMessage = err.response?.data?.message || "Terjadi kesalahan saat memulai proses pembayaran.";
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        console.error("❌ Error saat memulai proses pembayaran (Generic Error):", err.message);
        toast.error("Terjadi kesalahan saat memulai proses pembayaran.");
      } else {
        console.error("❌ Error saat memulai proses pembayaran (Unknown Error):", err);
        toast.error("Terjadi kesalahan saat memulai proses pembayaran (Kesalahan tak dikenal).");
      }
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition flex flex-col justify-around">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 h-[70px] overflow-auto">{content}</p>
      <div className="flex flex-col">
        {!canAccess && <p className="text-lg font-semibold text-green-600">{price === 0 ? "Gratis" : formatCurrency(price)}</p>}

        {canAccess ? (
          <Link href={link} className={`mt-3 w-fit px-4 py-2 text-white rounded-lg ${hasProgress ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}>
            {hasProgress ? "Lihat Materi" : "Mulai Belajar"}
          </Link>
        ) : session?.user ? (
          <button onClick={handleBayar} className="mt-3 w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            {price === 0 ? "Ambil Kelas Gratis" : "Beli Kelas Sekarang"}
          </button>
        ) : (
          <button onClick={handleLogin} className="mt-3 w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            {price === 0 ? "Login & Ambil Gratis" : "Login & Beli Kelas"}
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
