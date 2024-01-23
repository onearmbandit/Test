import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Sidebar />
      <Dashboard />
    </>
  );
}
