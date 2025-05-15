export type LeadershipCard = {
  image: string;
  name: string;
  role: string;
  responsibility: string;
};
export type PricingCardProps = {
  id: string;
  title: string;
  price: number;
  content: string | null;
  link: string;
  canAccess: boolean;
  hasProgress: boolean;
  onRefresh: () => void;
  CompanyCode: string;
  kelas: {
    title: string;
    CompanyCode: string;
  };
};

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
  videoUrl: string;
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
