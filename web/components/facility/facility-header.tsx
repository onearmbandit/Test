"use client";

import { facilityDetails } from "@/services/facility.api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const FacilityHeader = () => {
  const searchParams = useSearchParams();

  const facilityId = searchParams.get("facilityId");
  const {
    data: facility,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["facilitydetails", facilityId],
    queryFn: () => facilityDetails(facilityId!),
    staleTime: 30,
  });

  return (
    <div className="mt-3">
      <p className="font-bold text-lg">{facility?.data?.name}</p>
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        {status == "success" && facility?.data?.facilityEmission.length > 0 && (
          <div className="flex justify-between items-center py-3">
            <p className="text-xs font-bold">TOTAL tCO2e</p>
            <p className="text-[2.5rem] text-green-900 font-extrabold">
              {facility?.data?.facilityEmission[0]?.emission_sum}
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default FacilityHeader;
