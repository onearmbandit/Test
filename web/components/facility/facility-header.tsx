"use client";

import { facilityDetails } from "@/services/facility.api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const FacilityHeader = () => {
  const searchParams = useSearchParams();
  const [totalEmission, setTotalEmission] = useState(0);

  const facilityId = searchParams.get("facilityId");
  const {
    data: facility,
    isLoading,
    status,
    isSuccess,
  } = useQuery({
    queryKey: ["facilitydetails", facilityId],
    queryFn: () => facilityDetails(facilityId!),
    staleTime: 3000,
  });

  useEffect(() => {
    if (isSuccess) {
      let total = 0;
      facility?.data?.facilityEmission?.map((item: any) => {
        total += item.emission_sum;
      });
      setTotalEmission(total);
    }
  }, [isSuccess, facility]);

  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <div className="mt-3">
        <p className="font-bold text-lg">{facility?.data?.name}</p>
        <div className="flex justify-between items-center py-3">
          <p className="text-xs font-bold">TOTAL tCO2e</p>
          <p className="text-[2.5rem] text-green-900 font-extrabold">
            {/* {facility?.data?.facilityEmission[0]?.emission_sum} */}
            {totalEmission}
          </p>
        </div>
      </div>
    </Suspense>
  );
};

export default FacilityHeader;
