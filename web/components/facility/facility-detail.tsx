"use client";

import { ChevronDown, HelpCircle, Loader2, Plus } from "lucide-react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ProductLines from "./product-lines";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ReportingPeriod from "./reporting-period";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useQuery } from "@tanstack/react-query";
import { getReportingPeriods } from "@/services/facility.api";
import dayjs from "dayjs";

const FacilityDetails = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const facilityId = searchParams.get("facilityId");
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const periodsQ = useQuery({
    queryKey: ["reporting-periods"],
    queryFn: () => getReportingPeriods(facilityId as string),
  });
  const reportingPeriods = periodsQ.isSuccess ? periodsQ.data.data : [];
  // const newReporting = searchParams.get("new");
  // const reporting = searchParams.get("reporting");
  // const reportingPeriod = reporting != null ? reporting : reportingPeriods[0];
  // const currentTab = newReporting == "true" ? "new" : reportingPeriod!;

  const getTabValue = (period: any) => {
    return `${dayjs(period.reporting_period_from).format("MMM YYYY")} - ${dayjs(
      period.reporting_period_to
    ).format("MMM YYYY")}`;
  };

  useEffect(() => {
    if (periodsQ.isSuccess) {
      setCurrentTab(getTabValue(reportingPeriods[0]));
    }
  }, [periodsQ.isSuccess]);

  return (
    <div className="mt-5">
      <div className="flex justify-end">
        <p
          onClick={() =>
            // router.push(pathname + "?" + createQueryString("new", "true"))
            setShowNew(true)
          }
          role="button"
          className="text-sm font-semibold flex gap-1 items-center text-blue-600 py-1"
        >
          <Plus size={16} /> Add Reporting Period
        </p>
      </div>

      <div className="mt-3 relative">
        {/* <ReportingPeriod /> */}
        {periodsQ.isLoading && (
          <Loader2 className="text-blue-500 animate-spin" />
        )}
        {periodsQ.isSuccess && (
          <Tabs value={showNew ? "new" : currentTab!}>
            <TabsList className="border-b border-gray-200 w-full">
              {showNew && (
                <TabsTrigger value="new">
                  <Popover defaultOpen={true}>
                    <PopoverTrigger className="text-blue-600">
                      Add Reporting Period
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-full left-0 p-0 -ml-4"
                    >
                      <ReportingPeriod setNew={setShowNew} />
                    </PopoverContent>
                  </Popover>
                </TabsTrigger>
              )}
              {reportingPeriods.map((item: any, i: number) => {
                const reporting = `${dayjs(item.reporting_period_from).format(
                  "MMM YYYY"
                )} - ${dayjs(item.reporting_period_to).format("MMM YYYY")}`;
                return (
                  <TabsTrigger
                    key={i}
                    value={reporting}
                    onClick={() => setCurrentTab(reporting)}
                  >
                    <Popover>
                      <PopoverTrigger className="text-blue-600">
                        {dayjs(item.reporting_period_from).format("MMM YYYY")} -{" "}
                        {dayjs(item.reporting_period_to).format("MMM YYYY")}
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-full left-0 p-0 -ml-4"
                      >
                        <ReportingPeriod setNew={setShowNew} period={item} />
                      </PopoverContent>
                    </Popover>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value={currentTab!}>
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="1" className="border rounded-lg p-6">
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-[100px]">
                        1
                      </div>
                      <a
                        href="#"
                        className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full"
                      >
                        Add Scope Emissions
                      </a>
                    </section>
                    <ChevronDown size={16} className="text-slate-700" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-5 max-md:max-w-full">
                      <form>
                        <div className="flex gap-5 items-center max-md:flex-col max-md:gap-0">
                          <div className="flex flex-col items-stretch w-[48%] max-md:ml-0 max-md:w-full space-y-6">
                            {/* Scope 1 */}
                            <div className="flex gap-3 items-stretch py-0.5 max-md:flex-wrap max-md:max-w-full">
                              <div className="flex gap-3 justify-center items-stretch px-3 py-1 my-auto bg-blue-100 bg-opacity-50 rounded-[999px]">
                                <div className="flex flex-col bg-blue-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                                <p className="text-xs font-semibold leading-4 text-center text-blue-800">
                                  SCOPE 1
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <label
                                  htmlFor="totalEmissions1"
                                  className="grow justify-center self-stretch my-auto text-xs font-light leading-4 whitespace-nowrap text-slate-700"
                                >
                                  Total Emissions
                                </label>
                                <Input
                                  id="totalEmissions1"
                                  placeholder="tCO2e"
                                  className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-xs font-light leading-4 bg-gray-50 rounded-md text-slate-500"
                                />
                                <p className="text-xs text-gray-700 font-light">
                                  tCO2e
                                </p>
                              </div>
                            </div>

                            {/* Scope  2 */}
                            <div className="flex gap-3 items-stretch py-0.5 max-md:flex-wrap max-md:max-w-full">
                              <div className="flex gap-3 justify-center items-stretch px-3 py-1 my-auto bg-red-100 bg-opacity-50 rounded-[999px]">
                                <div className="flex flex-col bg-red-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                                <p className="text-xs font-semibold leading-4 text-center text-red-800">
                                  SCOPE 2
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <label
                                  htmlFor="totalEmissions2"
                                  className="grow justify-center self-stretch my-auto text-xs font-light leading-4 whitespace-nowrap text-slate-700"
                                >
                                  Total Emissions
                                </label>
                                <Input
                                  id="totalEmissions2"
                                  placeholder="tCO2e"
                                  className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-xs font-light leading-4 bg-gray-50 rounded-md text-slate-500"
                                />
                                <p className="text-xs text-gray-700 font-light">
                                  tCO2e
                                </p>
                              </div>
                            </div>

                            {/* Scope 3 */}
                            <div className="flex gap-3 items-stretch py-0.5 max-md:flex-wrap max-md:max-w-full">
                              <div className="flex gap-3 justify-center items-stretch px-3 py-1 my-auto bg-green-100 bg-opacity-50 rounded-[999px]">
                                <div className="flex flex-col bg-green-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                                <p className="text-xs font-semibold leading-4 text-center text-green-800">
                                  SCOPE 3
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <label
                                  htmlFor="totalEmissions3"
                                  className="grow justify-center self-stretch my-auto text-xs font-light leading-4 whitespace-nowrap text-slate-700"
                                >
                                  Total Emissions
                                </label>
                                <Input
                                  id="totalEmissions3"
                                  placeholder="tCO2e"
                                  className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-xs font-light leading-4 bg-gray-50 rounded-md text-slate-500"
                                />
                                <p className="text-xs text-gray-700 font-light">
                                  tCO2e
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-sky-50/50 grow rounded-md p-6 space-y-6">
                            <div className="flex gap-3">
                              <div className="flex gap-3 justify-center items-stretch px-3 py-2 my-auto bg-blue-100 bg-opacity-50 rounded-[999px]">
                                <div className="flex flex-col bg-blue-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                                <p className="text-xs font-semibold leading-4 text-center text-blue-800">
                                  SCOPE 1
                                </p>
                              </div>
                              <div className="flex gap-3 justify-center items-stretch px-3 py-2 my-auto bg-red-100 bg-opacity-50 rounded-[999px]">
                                <div className="flex flex-col bg-red-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                                <p className="text-xs font-semibold leading-4 text-center text-red-800">
                                  SCOPE 2
                                </p>
                              </div>
                              <div className="flex gap-3 justify-center items-stretch px-3 py-2 my-auto bg-green-100 bg-opacity-50 rounded-[999px]">
                                <div className="flex flex-col bg-green-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                                <p className="text-xs font-semibold leading-4 text-center text-green-800">
                                  SCOPE 3
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-bold text-slate-800 ">
                              Scope 1 Emissions
                            </p>
                            <p className="leading-6 w-[25rem]">
                              Scope 1 emissions are direct greenhouse gas (GHG)
                              emissions that a company generates while
                              performing its business activities. These
                              emissions come from sources that are owned or
                              controlled by an organization.
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            size={"sm"}
                            className="ml-auto items-stretch self-end px-4 py-2 mt-4 text-sm font-semibold leading-4 text-center"
                          >
                            Save
                          </Button>
                        </div>
                      </form>
                    </div>
                  </AccordionContent>
                  {/* <p className="text-xs font-light text-slate-700 mt-[1.88rem] [&[data-state=open]]:hidden">
                  Enter your reporting above. Then fill your scope 1, 2, and 3,
                  emissions for this facility within the reporting period.
                </p> */}
                </AccordionItem>

                <AccordionItem
                  value="2"
                  className="border rounded-lg p-6 space-y-3"
                >
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-[100px]">
                        2
                      </div>
                      <a
                        href="#"
                        className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full"
                      >
                        Add product lines to your facility
                      </a>
                    </section>
                    <ChevronDown size={16} className="text-slate-700" />
                  </AccordionTrigger>

                  <p className="text-xs font-light text-slate-700 mt-[1.88rem]">
                    Add product lines associated with this facilities reporting
                    period
                  </p>
                  <AccordionContent>
                    <ProductLines />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="3"
                  className="border rounded-lg p-6 space-y-3"
                >
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-[100px]">
                        3
                      </div>
                      <a
                        href="#"
                        className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full"
                      >
                        Assign carbon emissions to product line
                      </a>
                    </section>
                    <ChevronDown size={16} className="text-slate-700" />
                  </AccordionTrigger>
                  <p className="text-xs font-light text-slate-700 mt-[1.88rem]">
                    Assign Scope 1, 2, and 3 emissions directly to specific
                    product lines within your facility by functional unit.
                  </p>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="vv">AVVVV</TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default FacilityDetails;
