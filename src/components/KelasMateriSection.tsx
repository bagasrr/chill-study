// // Client Component
// "use client";

// import { useMateriWithAccess } from "@/lib/hooks/useMateriWithAccess";
// import { PricingCard } from "@/components/PricingCard";
// import CardSkeleton from "@/components/Skeleton/CardSkeleton";

// export const KelasMateriSection = ({ kelasId, kelasNama }: { kelasId: string; kelasNama: string }) => {
//   const { materiList, isLoading } = useMateriWithAccess(kelasId);

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 gap-4">
//         {[...Array(3)].map((_, i) => (
//           <CardSkeleton key={i} />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-4">
//       {materiList.map((materi: any) => (
//         <PricingCard key={materi.id} id={materi.id} title={materi.title} price={materi.price} link={`/dashboard/kelas/${kelasNama}/materi/${materi.id}`} canAccess={materi.canAccess} content={materi.description}  />
//       ))}
//     </div>
//   );
// };

// Tidak Digunakan
