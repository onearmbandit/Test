"use client";
import React from "react";
import EditAddress from "@/components/popups/organisation/edit-address";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <EditAddress />
    </>
  );
};

export default Page;
