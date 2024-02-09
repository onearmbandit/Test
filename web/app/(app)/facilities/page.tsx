import AutocompleteInput from "@/components/Autocomplete";
import FacilityEmissionsSummary from "@/components/FacilityEmissionsSummary";
import AddFacility from "@/components/facility/add-facility";
import FacilitiesList from "@/components/facility/facilities-list";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/lib/utils";
import { getFacilities } from "@/services/facility.api";
import { ChevronLeft, Plus } from "lucide-react";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import React from "react";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const session = await getServerSession(authOptions);
  const { data: facilities } = await getFacilities();

  return (
    <div className="p-6 bg-white w-full">
      {/* Nav */}
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/" className="text-slate-500">
            Organization Profile
          </a>{" "}
          &gt;{" "}
          <a href="/facilities" className="text-blue-600 font-bold">
            {session?.user?.organizations[0].company_name}&apos;s Facilities
          </a>{" "}
        </nav>
      </div>

      <div className="mt-3 space-y-3">
        <h2 className="text-slate-800 text-ellipsis whitespace-nowrap text-lg font-bold leading-7 max-w-[73px]">
          {session?.user?.organizations[0].company_name}&apos;s Facilities
        </h2>

        {facilities.length > 0 && <FacilitiesList facilities={facilities} />}

        {searchParams["add-new"] == "true" && (
          <AddFacility serialNo={facilities.length + 1 || 1} />
        )}

        {searchParams["add-new"] != "true" && (
          <Link
            href={"/facilities?add-new=true"}
            className="gap-1.5 text-sm font-semibold text-blue-600 rounded border-2 flex w-fit items-center ml-auto border-blue-600 px-4 py-1"
          >
            <Plus size={16} className="text-blue-600" />
            Add New Facility
          </Link>
        )}
      </div>
    </div>
  );
};

export default Page;
