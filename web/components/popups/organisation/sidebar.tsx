"use client";
import { useAccountStore } from "@/lib/stores/organisation.store";
import { cn } from "@/lib/utils";
import { getUser } from "@/services/user.api";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";

const AccountsNav = () => {
  const {
    navItem: currentNav,
    setNav,
    setOrgSection,
    setMyAccSection,
  } = useAccountStore();
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];

  const { data, isLoading } = useQuery({
    queryKey: ["account-details"],
    queryFn: () => getUser(),
  });

  return (
    <div className="flex flex-col items-stretch w-[28%] max-md:w-full max-md:ml-0">
      <div className="items-stretch bg-gray-50 flex w-full grow rounded-s-lg flex-col mx-auto pt-6 pb-12 px-6 max-md:px-5">
        <h2 className="text-gray-500 text-xs font-bold leading-4">Accounts</h2>
        <div className="items-stretch bg-gray-100 bg-opacity-0 flex flex-col mt-2.5 py-3.5">
          <div className="overflow-hidden text-slate-800 text-ellipsis text-sm font-bold leading-5 whitespace-nowrap">
            {data?.data?.first_name} {data?.data?.last_name}
          </div>
          <div className="overflow-hidden text-gray-500 text-ellipsis text-xs leading-4">
            {data?.data?.email}
          </div>
        </div>
        <span
          onClick={() => {
            setNav("myAccount");
            setMyAccSection("home");
          }}
          className={cn(
            "items-center hover:bg-blue-50 hover:text-blue-700 cursor-default flex justify-between gap-3 mt-2.5 px-2.5 py-1.5 rounded-md",
            currentNav == "myAccount" && "bg-blue-100 text-blue-700"
          )}
        >
          <p className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1905b383fa92fd8617ddcdb4231b581c79dc55e495e9cb3e4c5d960c1347e2a7?apiKey=011554aff43544e6af46800a427fd184&"
              alt="Account icon"
            />
          </p>
          <div className="text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            My account
          </div>
        </span>
        <span
          onClick={() => {
            setNav("organisation");
            setOrgSection("home");
          }}
          className={cn(
            "items-center hover:bg-blue-50 hover:text-blue-700 cursor-default flex justify-between gap-3 mt-2.5 px-2.5 py-1.5 rounded-md",
            currentNav == "organisation" && "bg-blue-100 text-blue-700"
          )}
        >
          <p className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6a8109a28d027733b2973f335a1a6505c2a85e896493267b51fd050ddb9dfb2b?apiKey=011554aff43544e6af46800a427fd184&"
              alt="Organization icon"
            />
          </p>
          <div className="text-xs font-medium leading-5 self-stretch grow whitespace-nowrap">
            Organization account
          </div>
        </span>
      </div>
    </div>
  );
};

export default AccountsNav;
