export type LeadershipCard = {
  image: string;
  name: string;
  role: string;
  responsibility: string;
};
export type PricingCardProps = {
  title: string;
  price: number;
  description: string;
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
