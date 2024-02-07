"use client";

import { getUser } from "@/services/user.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Header = () => {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["climate-commitments"],
    queryFn: () => getUser(),
  });
  return (
    <div className="justify-between self-stretch gap-5 flex flex-row w-full py-2 max-md:px-5">
      <header className="text-slate-800 text-ellipsis text-base font-semibold leading-6 my-auto">
        {data?.data?.organizations[0]?.company_name}
      </header>
      <div className="justify-center flex flex-col pl-16 py-6 items-end max-md:max-w-full max-md:pl-5">
        <div className="text-gray-900 text-xs font-medium leading-4 whitespace-nowrap justify-center items-stretch bg-gray-50 p-2 rounded-md">
          {data?.data?.organizations[0]?.naics_code && (
            <>NACIS: {data?.data?.organizations[0]?.naics_code}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
