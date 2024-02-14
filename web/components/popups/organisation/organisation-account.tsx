import { formatAddress } from "@/lib/utils";
import { getUser } from "@/services/user.api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import parse from "html-react-parser";

const OrganisationAccount = ({
  section,
  setSection,
}: {
  section: string;
  setSection: (val: string) => void;
}) => {
  const userQ = useQuery({
    queryKey: ["account-details"],
    queryFn: () => getUser(),
  });

  const user = userQ.isSuccess ? userQ.data : null;

  return (
    <section className="justify-center items-start bg-white rounded-e-lg flex flex-col w-full p-6 max-md:max-w-full max-md:px-5">
      <h2 className="text-gray-700 text-lg font-bold leading-7 self-stretch max-md:max-w-full">
        Organization Account
      </h2>
      <div className="bg-gray-300 self-stretch w-full shrink-0 h-px mr-2.5 mt-2.5" />
      <div className="items-stretch flex gap-2.5 mt-2.5 py-3 self-start">
        <a
          href="#"
          className="text-blue-700 text-xs font-bold leading-4 whitespace-nowrap justify-center items-stretch bg-blue-100 px-5 py-6 rounded-md max-md:px-5"
        >
          PC
        </a>
        <div className="justify-center items-stretch self-center flex grow basis-[0%] flex-col my-auto">
          <h3 className="text-slate-700 text-xs font-bold leading-4">Name</h3>
          <div className="text-slate-700 text-sm leading-5 mt-2.5">
            {user?.data?.organizations[0]?.company_name}
          </div>
        </div>
      </div>
      <h3 className="text-gray-700 text-sm font-bold leading-5 self-stretch mr-2.5 mt-6 max-md:max-w-full">
        About the Organization
      </h3>
      <div className="bg-gray-300 self-stretch w-full shrink-0 h-px mr-2.5 mt-2" />
      <div className="items-stretch text-slate-700 text-xs font-medium leading-5 self-stretch mt-2.5 max-md:max-w-full">
        Address
      </div>
      <div className="justify-between items-stretch content-center gap-y-2.5 self-stretch flex-wrap flex gap-5 mt-2.5 max-md:max-w-full">
        <div className="text-slate-700 text-xs font-light leading-4">
          {user?.data?.organizations[0]?.company_address
            ? parse(
                user?.data?.organizations[0]?.company_address.replaceAll(
                  /\n/g,
                  "<br>"
                )
              )
            : "-"}
        </div>
        <p
          onClick={() => setSection("address")}
          className="text-blue-600 text-center text-xs font-bold leading-4 self-center my-auto cursor-pointer"
        >
          Edit
        </p>
      </div>
      <div className="text-slate-700 text-xs font-medium leading-5 self-stretch mt-2.5 max-md:max-w-full">
        Number of Employees
      </div>
      <div className="justify-between items-stretch self-stretch flex gap-5 mt-2.5 py-2 max-md:max-w-full max-md:flex-wrap">
        <div className="text-slate-700 text-xs font-light leading-4">
          {user?.data?.organizations[0]?.company_size}
        </div>
        <p
          onClick={() => setSection("employees")}
          className="text-blue-600 text-center text-xs font-bold leading-4 cursor-pointer"
        >
          Edit
        </p>
      </div>
      <div className="text-slate-700 text-xs font-medium leading-5 self-stretch mt-2.5 max-md:max-w-full">
        NAICS Code
      </div>
      <div className="justify-between items-stretch self-stretch flex gap-5 mt-2.5 py-2 max-md:max-w-full max-md:flex-wrap">
        <div className="text-slate-700 text-xs font-light leading-4">
          {user?.data?.organizations[0]?.naics_code}
        </div>
        <p
          onClick={() => setSection("naics")}
          className="text-blue-600 text-center text-xs font-bold leading-4 cursor-pointer"
        >
          Edit
        </p>
      </div>
      <div className="flex items-end justify-between w-full">
        <div className="text-slate-700 text-xs font-medium leading-5 self-stretch mt-2.5 max-md:max-w-full">
          Climate Commitments
        </div>
        <p
          onClick={() => setSection("climate")}
          className="text-blue-600 text-center text-xs font-bold leading-4 cursor-pointer"
        >
          Edit
        </p>
      </div>
      <div className="justify-between items-stretch self-stretch flex gap-5 mt-2.5 py-2  max-w-full flex-wrap max-h-[4rem] overflow-auto">
        {user?.data?.organizations[0]?.climate_targets?.map(
          (target: string, i: number) => (
            <div
              key={i}
              className="text-slate-700 text-xs font-light leading-4"
            >
              {target}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default OrganisationAccount;
