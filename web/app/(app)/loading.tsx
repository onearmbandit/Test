// "use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const loading = () => {
  const router = useRouter();
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
  }
  return (
    <div className="h-screen w-screen grid place-items-center">
      <Loader2 size={40} className="animate-spin text-blue-600" />
    </div>
  );
};

export default loading;
