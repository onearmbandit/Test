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
import ScopeEmissions from "./scope-emission";
import ProductLineEmissions from "./product-line-emissions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

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
  console.log(reportingPeriods);
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
      setCurrentTab(reportingPeriods[0]?.id);
      if (reportingPeriods.length == 0) {
        setShowNew(true);
      }
    }
  }, [periodsQ.isSuccess, reportingPeriods]);

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
          <Tabs
            value={showNew ? "new" : currentTab!}
            onValueChange={setCurrentTab}
          >
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
                  <TabsTrigger key={i} value={item.id}>
                    <HoverCard key={i}>
                      <HoverCardTrigger asChild>
                        <p className="text-blue-600">{reporting}</p>
                      </HoverCardTrigger>
                      <HoverCardContent
                        align="start"
                        className="w-full left-0 p-0 -ml-4"
                      >
                        <ReportingPeriod setNew={setShowNew} period={item} />
                      </HoverCardContent>
                    </HoverCard>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value={currentTab!}>
              <Accordion
                type="multiple"
                defaultValue={["1"]}
                className="space-y-3"
              >
                <AccordionItem value="1" className="border rounded-lg p-6">
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
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
                    <ScopeEmissions period={currentTab} />
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
                      <div className="text-slate-700 text-xs font-semibold leading-4 justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
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
                    <ProductLines period={currentTab!} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="3"
                  className="border rounded-lg p-6 space-y-3"
                >
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
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
                  <p className="text-sm leading-5 font-light text-slate-700 mt-[1.88rem]">
                    Assign Scope 1, 2, and 3 emissions directly to specific
                    product lines within your facility by functional unit.
                  </p>
                  <AccordionContent>
                    <ProductLineEmissions period={currentTab!} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="new">
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="1" className="border rounded-lg p-6">
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 flex justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
                        1
                      </div>
                      <p className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full">
                        Add Scope Emissions
                      </p>
                    </section>
                    <ChevronDown size={16} className="text-slate-700" />
                  </AccordionTrigger>

                  <p className="text-sm leading-5 font-light text-slate-700 mt-4 [&[data-state=open]]:hidden">
                    Enter your reporting above. Then fill your scope 1, 2, and
                    3, emissions for this facility within the reporting period.
                  </p>
                </AccordionItem>

                <AccordionItem
                  value="2"
                  className="border rounded-lg p-6 space-y-3"
                >
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 flex justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
                        2
                      </div>
                      <a
                        href="#"
                        className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full"
                      >
                        Add product lines to your facility
                      </a>
                    </section>
                    <ChevronDown size={16} className="text-slate-700 " />
                  </AccordionTrigger>

                  <p className="text-sm leading-5 font-light text-slate-700 mt-[1.88rem]">
                    Add product lines associated with this facilities reporting
                    period
                  </p>
                </AccordionItem>
                <AccordionItem
                  value="3"
                  className="border rounded-lg p-6 space-y-3"
                >
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 flex justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
                        3
                      </div>
                      <p className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full">
                        Assign carbon emissions to product line
                      </p>
                    </section>
                    <ChevronDown size={16} className="text-slate-700" />
                  </AccordionTrigger>
                  <p className="text-sm leading-5 font-light text-slate-700 mt-[1.88rem]">
                    Assign Scope 1, 2, and 3 emissions directly to specific
                    product lines within your facility by functional unit.
                  </p>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default FacilityDetails;
