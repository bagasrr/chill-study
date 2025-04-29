"use client";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  return <div>Id : {id}</div>;
};

export default Page;
