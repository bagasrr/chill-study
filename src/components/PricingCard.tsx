// components/PricingCard.tsx
import { PricingCardProps } from "@/lib/type";
import { formatCurrency } from "@/lib/utils";

export const PricingCard: React.FC<PricingCardProps> = ({ title, price, description }) => {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition flex flex-col justify-around">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div>
        <p className="text-lg font-semibold text-green-600">{formatCurrency(price)}</p>
        <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{price === 0 ? "Lihat Materi" : "Beli Sekarang"}</button>
      </div>
    </div>
  );
};
