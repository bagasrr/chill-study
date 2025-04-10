import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/"); // atau redirect ke /login
  }

  return (
    <div>
      <h1>This page is protected</h1>
      <p>Welcome, {session.user?.name}</p>
    </div>
  );
}
