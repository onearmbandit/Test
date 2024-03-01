import Dashboard from "@/components/Dashboard";
import { authOptions } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // console.log('session from home page : ', session);

  return (
    <>
      <Dashboard />
    </>
  );
}
