import { verifyEmail } from "@/services/auth.api";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { token } = searchParams;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await verifyEmail(token);

    return (
      <div className="grid place-items-center h-screen">
        <div className="border rounded-lg p-16 flex flex-col w-[729px]">
          <Image
            width={177}
            height={39}
            alt="logo"
            src="/assets/images/Logo.svg"
            className="self-center mb-10"
          />
          <p className="text-green-500 text-center">Success! Email Verified</p>
          <Link
            href={"/login"}
            className="text-center inline-block font-medium w-fit px-4 py-3 mt-[300px] mx-auto rounded bg-blue-600 text-white"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="grid place-items-center h-screen">
        <div className="border rounded-lg p-16 flex flex-col w-[729px]">
          <Image
            width={177}
            height={39}
            alt="logo"
            src="/assets/images/Logo.svg"
            className="self-center mb-10"
          />
          <p className="text-red-500 text-center text-lg font-medium">
            {error.message}
          </p>
          <Link
            href={"/login"}
            className="text-center inline-block font-medium w-fit px-4 py-3 mt-[300px] mx-auto rounded bg-blue-600 text-white"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }
};

export default Page;
