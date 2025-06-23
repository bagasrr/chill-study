export type LeadershipCard = {
  image: string;
  name: string;
  role: string;
  responsibility: string;
};
export interface PricingCardProps {
  id: string;
  title: string;
  price: number;
  link: string;
  canAccess: boolean;
  onRefresh: () => void; // Jika ini masih relevan untuk refresh data di komponen PricingCard
  content?: string; // Sesuaikan dengan tipe sebenarnya jika ada
  hasProgress: boolean;
  CompanyCode?: string;
  kelas?: Kelas; // Atau buat interface Kelas jika ingin lebih spesifik
  // Tambahkan properti lain yang mungkin ada dari materi di kelas-detail
  contents?: Array<{
    id: string;
    type: string;
    title: string;
    weight: number;
    url: string;
  }>;
}

export interface Kelas {
  id: string;
  title: string;
  deskripsi: string;
  thumbnail: string;
  CompanyCode: string;
  materi: PricingCardProps[]; // Array of materi with access info
  // ... properti kelas lainnya
}

export type User = {
  id: string;
  name: string;
  email: string;
  deviceToken: string;
  role: string;
  createdAt: string;
};

export type Order = "asc" | "desc";

export type MateriCard = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  price: number;
  CreatedBy: string;
  LastUpdatedBy: Date;
  LastUpdateDate: Date;
  kelas: {
    CompanyCode: string;
  };
};

export type ProgramCardType = {
  id: string;
  thumbnail: string;
  title: string;
  deskripsi: string;
  CompanyCode: string;
};
