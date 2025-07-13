export type LeadershipCardType = {
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
  isActive?: boolean;
  kelas?: Kelas;
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

export type PaymentStatus = "COMPLETED" | "PENDING" | "CANCELLED" | "REFUNDED";

// Definisi tipe untuk model Payment
export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  status: PaymentStatus;
  createdAt: string; // Atau Date jika Anda mengonversi di backend
  IsDeleted: string | null; // DateTime? di Prisma jadi string | null
  CreatedBy: string | null;
  LastUpdatedBy: string | null;
  LastUpdateDate: string | null; // DateTime? di Prisma jadi string | null
  Status: number | null; // Int? di Prisma jadi number | null
  CompanyCode: string | null;
}
