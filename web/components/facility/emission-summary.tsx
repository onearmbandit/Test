"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { facilityDetails } from "@/services/facility.api";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import dayjs from "dayjs";

const EmissionSummary = () => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");
  const [allPeriods, setAllPeriods] = useState(false);
  const facility = useQuery({
    queryKey: ["facility-details", facilityId],
    queryFn: () => facilityDetails(facilityId!),
  });
  const details = facility.isSuccess ? facility.data.data : {};

  const sliced = facility.isSuccess && details.facilityEmission.slice(0, 2);
  const emissions = allPeriods ? details?.facilityEmission : sliced;

  return (
    <div className="grid grid-cols-3 gap-6">
      {facility.isLoading && <Loader2 className="text-blue-500 animate-spin" />}
      {facility.isSuccess && (
        <>
          <Card className="p-4">
            <CardHeader className="border-b p-0 pb-3">
              <div className="flex gap-3 items-stretch w-fit px-6 py-2 my-auto bg-blue-100 bg-opacity-50 rounded-[999px]">
                <div className="flex flex-col bg-blue-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                <p className="text-xs font-semibold leading-4 text-center text-blue-800">
                  SCOPE 1
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-3">
              <div className="flex justify-between items-center font-bold py-6">
                <p className="text-xs">TOTAL tCO2e</p>
                <p className="text-lg text-green-900">{}</p>
              </div>

              <div className="space-y-3">
                {emissions?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-700">
                      {dayjs(item.reporting_period_from).format("MMM YY")} -{" "}
                      {dayjs(item.reporting_period_to).format("MMM YY")}{" "}
                    </p>
                    <p className="text-green-900 text-xs">
                      {item.scope1_total_emission || "Not Available"}
                    </p>
                  </div>
                ))}
                {emissions?.length > 2 && <p className="font-bold">...</p>}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="border-b p-0 pb-3">
              <div className="flex gap-3 justify-center items-stretch w-fit px-6 py-2 my-auto bg-red-100 bg-opacity-50 rounded-[999px]">
                <div className="flex flex-col bg-red-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                <p className="text-xs font-semibold leading-4 text-center text-red-800">
                  SCOPE 2
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-3">
              <div className="flex justify-between items-center font-bold py-6">
                <p className="text-xs">TOTAL tCO2e</p>
                <p className="text-lg text-green-900">{}</p>
              </div>

              <div className="space-y-3">
                {emissions?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-700">
                      {dayjs(item.reporting_period_from).format("MMM YY")} -{" "}
                      {dayjs(item.reporting_period_to).format("MMM YY")}{" "}
                    </p>
                    <p className="text-green-900 text-xs">
                      {item.scope2_total_emission || "Not Available"}
                    </p>
                  </div>
                ))}
                {emissions?.length > 2 && <p className="font-bold">...</p>}
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="border-b p-0 pb-3">
              <div className="flex gap-3 justify-center items-stretch w-fit px-6 py-2 my-auto bg-green-100 bg-opacity-50 rounded-[999px]">
                <div className="flex flex-col bg-green-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                <p className="text-xs font-semibold leading-4 text-center text-green-800">
                  SCOPE 3
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-3">
              <div className="flex justify-between items-center font-bold py-6">
                <p className="text-xs">TOTAL tCO2e</p>
                <p className="text-lg text-green-900">{}</p>
              </div>

              <div className="space-y-3">
                {emissions?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-700">
                      {dayjs(item.reporting_period_from).format("MMM YY")} -{" "}
                      {dayjs(item.reporting_period_to).format("MMM YY")}{" "}
                    </p>
                    <p className="text-green-900 text-xs">
                      {item.scope3_total_emission || "Not Available"}
                    </p>
                  </div>
                ))}
                {emissions?.length > 2 && <p className="font-bold">...</p>}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {emissions?.length > 2 && (
        <div className="col-span-3 justify-end place-items-end place-content-end">
          <p
            role="button"
            className="text-blue-600 text-sm w-full text-end font-semibold"
          >
            See all reporting periods
          </p>
        </div>
      )}
    </div>
  );
};

export default EmissionSummary;
