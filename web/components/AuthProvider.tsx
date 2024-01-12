"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

interface PropsWithChildren {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const token = typeof window != "undefined" && localStorage.getItem("token");
  if (!token) {
    router.push("/login");
  }
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
};

export default AuthProvider;
