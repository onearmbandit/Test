"use client";
import React from "react";
import OrganisationAccount from "@/components/popups/organisation/organisation-account";
import { usePathname, useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <OrganisationAccount />
    </>
  );
};

export default Page;
