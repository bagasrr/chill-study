import { authOptions } from "@/lib/auth";
import Tables from "@/ui/Tables";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  console.log("session: ", session);
  if (session?.user?.role !== "ADMIN") {
    redirect("/?error=not-admin");
  }

  return (
    <div className="text-white p-[2.5%]">
      <p>tes name : {session?.user?.name}</p>
      <p>tes role : {session?.user?.role}</p>
      <Tables />
    </div>
  );
};

export default page;
