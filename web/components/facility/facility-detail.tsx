"use client";

import { ChevronDown, Loader2, Plus } from "lucide-react";
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
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { cn, separateIntoChunks } from "@/lib/utils";
import { HoverCardPortal } from "@radix-ui/react-hover-card";

const FacilityDetails = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const facilityId = searchParams.get("facilityId");
  const router = useRouter();
  const [completeStatus, setCompleteStatus] = useState({
    1: false,
    2: false,
    3: false,
  });

  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  const periodsQ = useQuery({
    queryKey: ["reporting-periods"],
    queryFn: () => getReportingPeriods(facilityId as string),
  });
  const reportingPeriods = periodsQ.isSuccess ? periodsQ.data.data : [];

  const getTabValue = (period: any) => {
    return `${dayjs(period.reporting_period_from).format("MMM YYYY")} - ${dayjs(
      period.reporting_period_to
    ).format("MMM YYYY")}`;
  };

  const periodList =
    reportingPeriods.length > 0
      ? separateIntoChunks(reportingPeriods, showNew ? 5 : 6)
      : [[]];

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentTab(periodList[api.selectedScrollSnap()][0].id);
    });
  }, [api]);

  useEffect(() => {
    if (periodsQ.isSuccess) {
      setCurrentTab(reportingPeriods[0]?.id);
      if (reportingPeriods.length == 0) {
        setShowNew(true);
      }
    }
  }, [periodsQ.isSuccess, periodsQ.data]);

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
            onValueChange={(e) => {
              setShowNew(false);
              setCurrentTab(e);
            }}
          >
            <TabsList className="border-b border-gray-200 w-full">
              <Carousel
                opts={{ align: "start" }}
                setApi={setApi}
                className="w-full"
              >
                <CarouselContent className="max-w-full">
                  {periodList.map((item: any, i: number) => (
                    <CarouselItem key={i}>
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
                      {item.map((slide: any, i: number) => {
                        const reporting = `${dayjs(
                          slide.reporting_period_from
                        ).format("MMM YYYY")} - ${dayjs(
                          slide.reporting_period_to
                        ).format("MMM YYYY")}`;
                        return (
                          <TabsTrigger key={i} value={slide.id}>
                            <HoverCard key={i}>
                              <HoverCardTrigger asChild>
                                <p className="text-blue-600">{reporting}</p>
                              </HoverCardTrigger>
                              <HoverCardPortal>
                                <HoverCardContent
                                  align="start"
                                  className="w-full left-0 p-0 -ml-4"
                                >
                                  <ReportingPeriod
                                    setNew={setShowNew}
                                    period={slide}
                                  />
                                </HoverCardContent>
                              </HoverCardPortal>
                            </HoverCard>
                          </TabsTrigger>
                        );
                      })}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext variant={"ghost"} />
                <CarouselPrevious variant={"ghost"} />
              </Carousel>
            </TabsList>
            <TabsContent value={currentTab!}>
              <Accordion
                type="multiple"
                defaultValue={["1"]}
                className="space-y-3"
              >
                <AccordionItem value="1" className="border rounded-lg p-6">
                  <AccordionTrigger className="flex-col items-start [&[data-state=open]>#scope-desc]:hidden">
                    <div className="items-stretch flex justify-between gap-5 w-full">
                      <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                        <div
                          className={cn(
                            "text-slate-700 text-xs font-semibold leading-4 rounded-full flex justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2",
                            completeStatus[1] && "bg-cyan-100 text-green-900"
                          )}
                        >
                          1
                        </div>
                        <p className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full">
                          Add Scope Emissions
                        </p>
                      </section>
                      <ChevronDown size={16} className="text-slate-700" />
                    </div>
                    <p
                      id="scope-desc"
                      className="text-xs font-light text-slate-700 mt-[1.88rem] [&[data-state=open]]:hidden"
                    >
                      Enter your reporting above. Then fill your scope 1, 2, and
                      3, emissions for this facility within the reporting
                      period.
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScopeEmissions
                      period={currentTab}
                      completeStatus={completeStatus}
                      setStatus={setCompleteStatus}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="2"
                  className="border rounded-lg p-6 space-y-3"
                >
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 rounded-full flex justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
                        2
                      </div>
                      <p className="justify-center text-green-950 text-base font-semibold leading-6 grow max-md:max-w-full">
                        Add product lines to your facility
                      </p>
                    </section>
                    <ChevronDown size={16} className="text-slate-700" />
                  </AccordionTrigger>

                  <p className="text-sm font-light text-slate-700 mt-[1.88rem]">
                    Add product lines associated with this facilities reporting
                    period
                  </p>
                  <AccordionContent>
                    <ProductLines
                      period={currentTab!}
                      completeStatus={completeStatus}
                      setStatus={setCompleteStatus}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="3"
                  className="border rounded-lg p-6 space-y-3"
                >
                  <AccordionTrigger className="items-stretch flex justify-between gap-5 py-3 max-md:max-w-full max-md:flex-wrap">
                    <section className="items-stretch flex justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
                      <div className="text-slate-700 text-xs font-semibold leading-4 flex rounded-full justify-center items-center bg-gray-100 aspect-square h-5 px-2 rounded-1/2">
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
                  <AccordionContent>
                    <ProductLineEmissions
                      period={currentTab!}
                      completeStatus={completeStatus}
                      setStatus={setCompleteStatus}
                    />
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
