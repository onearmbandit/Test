"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { facilityDetails } from "@/services/facility.api";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import dayjs from "dayjs";

const FacilityEmissionsSummary = () => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");
  const [allPeriods, setAllPeriods] = useState(false);
  const facility = useQuery({
    queryKey: ["facility-details", facilityId],
    queryFn: () => facilityDetails(facilityId!),
  });
  const details = facility.isSuccess ? facility.data.data : {};

  let scope1Total = 0;
  let scope2Total = 0;
  let scope3Total = 0;

  const sliced = facility.isSuccess && details?.facilityEmission.slice(0, 2);
  const emissions = allPeriods ? details?.facilityEmission : sliced;
  if (facility.isSuccess) {
    emissions?.map((item: any) => {
      scope1Total += item.scope1_total_emission;
      scope2Total += item.scope2_total_emission;
      scope3Total += item.scope3_total_emission;
    });
  }
  return (
    <div className="items-stretch bg-[#14532D0D] w-full my-3 flex flex-col rounded-lg">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="rounded-lg">
          <AccordionTrigger className="items-center bg-[#E3EAE6] flex w-full justify-between gap-5 px-4 py-2 rounded-md max-md:max-w-full max-md:flex-wrap">
            <div className="flex items-stretch justify-between gap-2">
              <div className="text-green-950 text-xs font-medium leading-5 self-center grow whitespace-nowrap my-auto">
                Facility Emissions Summary
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200" />
          </AccordionTrigger>
          <AccordionContent className="pb-0 p-3">
            {details?.facilityEmission?.length == 0 ? (
              <div className="justify-center items-center min-h-[19.25rem] self-stretch flex flex-col max-md:px-5">
                <section className="flex flex-col items-stretch text-lg text-slate-700 max-md:max-w-full">
                  <header
                    className="font-bold leading-[156%] self-center whitespace-nowrap"
                    aria-label="Emission data instruction heading"
                    role="heading"
                  >
                    Awaiting Your Emissions Data
                  </header>
                  <article
                    className="leading-[156%] mt-5 max-md:max-w-full"
                    aria-label="Emission data instruction text"
                    role="article"
                  >
                    Your facility emissions summary will appear here. Start by
                    adding your reporting data below.
                  </article>
                </section>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {facility.isLoading && (
                  <Loader2 className="text-blue-500 animate-spin" />
                )}
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
                          <p className="text-lg text-green-900">
                            {scope1Total}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {emissions?.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="flex justify-between items-center"
                            >
                              <p className="text-[10px] font-bold text-slate-700">
                                {dayjs(item.reporting_period_from).format(
                                  "MMM YY"
                                )}{" "}
                                -{" "}
                                {dayjs(item.reporting_period_to).format(
                                  "MMM YY"
                                )}{" "}
                              </p>
                              <p className="text-green-900 text-xs">
                                {item.scope1_total_emission || "Not Available"}
                              </p>
                            </div>
                          ))}
                          {details?.facilityEmission?.length > 2 &&
                            !allPeriods && <p className="font-bold">...</p>}
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
                          <p className="text-lg text-green-900">
                            {scope2Total}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {emissions?.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="flex justify-between items-center"
                            >
                              <p className="text-[10px] font-bold text-slate-700">
                                {dayjs(item.reporting_period_from).format(
                                  "MMM YY"
                                )}{" "}
                                -{" "}
                                {dayjs(item.reporting_period_to).format(
                                  "MMM YY"
                                )}{" "}
                              </p>
                              <p className="text-green-900 text-xs">
                                {item.scope2_total_emission || "Not Available"}
                              </p>
                            </div>
                          ))}
                          {details?.facilityEmission?.length > 2 &&
                            !allPeriods && <p className="font-bold">...</p>}
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
                          <p className="text-lg text-green-900">
                            {scope3Total}
                          </p>
                        </div>

                        <div className="space-y-3">
                          {emissions?.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="flex justify-between items-center"
                            >
                              <p className="text-[10px] font-bold text-slate-700">
                                {dayjs(item.reporting_period_from).format(
                                  "MMM YY"
                                )}{" "}
                                -{" "}
                                {dayjs(item.reporting_period_to).format(
                                  "MMM YY"
                                )}{" "}
                              </p>
                              <p className="text-green-900 text-xs">
                                {item.scope3_total_emission || "Not Available"}
                              </p>
                            </div>
                          ))}
                          {details?.facilityEmission?.length > 2 &&
                            !allPeriods && <p className="font-bold">...</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {details?.facilityEmission?.length > 2 && (
                  <div className="col-span-3 flex justify-end">
                    <p
                      role="button"
                      onClick={() => setAllPeriods(!allPeriods)}
                      className="text-blue-btn flex text-sm font-semibold"
                    >
                      {allPeriods
                        ? "Collapse reporting periods"
                        : "See all reporting periods"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FacilityEmissionsSummary;
