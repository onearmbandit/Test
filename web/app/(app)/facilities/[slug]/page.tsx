import FacilityEmissionsSummary from "@/components/FacilityEmissionsSummary";
import FacilityDetails from "@/components/facility/facility-detail";
import { authOptions } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth/next";
import React from "react";

const Page = async ({ params }: { params: any }) => {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-6 bg-white w-full">
      {/* Nav */}
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm leading-5 justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/" className="text-slate-500">
            Organization Profile
          </a>{" "}
          &gt;{" "}
          <a href="/facilities" className="text-slate-500">
            {session?.user?.organizations[0].company_name}&apos;s Facilities
          </a>{" "}
          &gt;{" "}
          <span className="font-bold text-blue-700" role="link">
            {params.slug.split("-").join(" ")}
          </span>
        </nav>
      </div>

      <FacilityEmissionsSummary />

      <FacilityDetails />
    </div>
  );
};

export default Page;
