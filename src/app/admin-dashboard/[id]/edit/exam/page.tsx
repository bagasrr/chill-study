"use client";
import EditExamForm from "@/components/EditForm/EditExamForm";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  return (
    <>
      <EditExamForm examId={id} />
    </>
  );
};

export default Page;
