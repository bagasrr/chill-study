import { authOptions } from "@/lib/auth";
import Tables from "@/ui/Tables";
import { getServerSession } from "next-auth";

const page = async () => {
  return (
    <div className="text-white p-[2.5%]">
      {/* <p>tes name : {session?.user?.name}</p>
      <p>tes role : {session?.user?.role}</p> */}
      <Tables />
    </div>
  );
};

export default page;
