"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ChevronDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { getFacilityDashboard } from "@/services/facility.api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Select, SelectContent, SelectItem } from "./ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import {
  Bar,
  ComposedChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const TotalEmissionsSummary = () => {
  const dashboardDetails = useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      getFacilityDashboard({
        from: "2024-01-01",
        to: "2024-06-01",
      }),
  });

  const dashboard = dashboardDetails.isSuccess
    ? dashboardDetails.data.data
    : {};

  const chartData = [
    {
      name: "Scope1",
      scope1: dashboard?.totalScope1EmissionForAllFacilities,
      scope2: 0,
      scope3: 0,
    },
    {
      name: "Scope2",
      scope1: 0,
      scope2: dashboard?.totalScope2EmissionForAllFacilities,
      scope3: 0,
    },
    {
      name: "Scope3",
      scope1: 0,
      scope2: 0,
      scope3: dashboard?.totalScope3EmissionForAllFacilities,
    },
  ];

  return (
    <div className="bg-white rounded-lg w-full mt-3">
      <Accordion type="single" collapsible>
        <AccordionItem value="total-emissions" className="px-16 py-6 border-0">
          <AccordionTrigger className="p-0 py-3 flex justify-between [&[data-state=open]>div>svg]:rotate-180 [&[data-state=closed]>#reporting]:hidden [&[data-state=open]>#emission-value]:hidden">
            <div className="flex items-center">
              <ChevronDown size={16} className="text-slate-600 mr-6" />
              <p className="text-xl font-semibold text-gray-700 pl-3">
                Total Emissions Across Facilities
              </p>
            </div>

            <p id="emission-value" className="text-sm font-bold text-green-950">
              {dashboard.totalEmission} tCO2e
            </p>
            <div id="reporting">
              <Select defaultValue="id">
                <SelectTrigger>
                  <SelectValue placeholder="Select a reporting period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">2024-01 to 2024-06</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-0 space-y-6">
            <div className="grid grid-cols-3 gap-[10px] h-[18.18rem]">
              <Card className="col-span-2 border-none shadow-md h-full">
                <CardHeader>
                  <p className="font-bold text-lg">Scope Emissions</p>
                </CardHeader>
                <CardContent className="h-[14rem] w-full">
                  {dashboardDetails.isLoading && (
                    <Loader2 className="text-blue-600 animate-spin" />
                  )}
                  {dashboardDetails.isSuccess && (
                    <ResponsiveContainer>
                      <ComposedChart
                        layout="vertical"
                        width={600}
                        height={200}
                        data={chartData}
                        stackOffset="positive"
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 0,
                        }}
                      >
                        <XAxis
                          // hide={true}
                          type="number"
                          axisLine={false}
                          // domain={["auto", "auto"]}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          axisLine={false}
                          scale="band"
                          padding={{ top: 0, bottom: 0 }}
                        />
                        <Bar
                          dataKey="scope1"
                          barSize={20}
                          radius={9}
                          fill="#BBF7D0"
                        />
                        <Bar
                          dataKey="scope2"
                          barSize={20}
                          radius={9}
                          fill="#BFDBFE"
                        />
                        <Bar
                          dataKey="scope3"
                          barSize={20}
                          radius={9}
                          fill="#FED7AA"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="flex flex-col border-none shadow-md">
                <CardHeader className="py-5">
                  <p className="text-center font-bold text-xs">
                    Total Carbon Emissions
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 justify-center items-center">
                  <p className="text-[2.625rem] font-bold text-center leading-[5.25rem] ">
                    {dashboard.totalEmission}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <p className="text-sm font-bold text-neutral-700">tCO2e</p>
                </CardFooter>
              </Card>
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem
                value="scope-emissions"
                className="border-0 bg-[#14532D0D] rounded-lg"
              >
                <AccordionTrigger className="px-4 py-2 rounded-lg bg-[#E3EAE6]">
                  <p className="text-xs font-medium leading-5 text-green-950">
                    Scope Emissions Across Facilities
                  </p>
                  <ChevronDown size={16} className="text-slate-500" />
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-3 gap-2 shadow border rounded-b-lg pt-5 px-3">
                  <Card className="p-4">
                    <CardHeader className="border-b p-0 pb-3 space-y-3">
                      <div className="flex gap-3 items-stretch w-fit px-6 py-2 my-auto bg-blue-100 bg-opacity-50 rounded-[999px]">
                        <div className="flex flex-col bg-blue-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                        <p className="text-xs font-semibold leading-4 text-center text-blue-800">
                          SCOPE 1
                        </p>
                      </div>
                      <p className="text-xs font-light text-gray-700">
                        Direct emissions within your own operations
                      </p>
                      <br className="leading-4" />
                    </CardHeader>
                    <CardContent className="p-0 pt-3">
                      <div className="flex justify-between items-center font-bold py-6">
                        <p className="text-xs">TOTAL tCO2e</p>
                        <p className="text-lg text-green-900">
                          {dashboard?.totalScope1EmissionForAllFacilities}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {dashboard?.finalResults?.map((item: any) => (
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold text-slate-700">
                              {item.facilityName}
                            </p>
                            <p className="text-green-900 text-xs">
                              {item.totalScope1TotalEmission || "Not Available"}
                            </p>
                          </div>
                        ))}
                        {/* {emissions?.length > 2 && (
                            <p className="font-bold">...</p>
                          )} */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardHeader className="border-b p-0 pb-3 space-y-3">
                      <div className="flex gap-3 justify-center items-stretch w-fit px-6 py-2 my-auto bg-red-100 bg-opacity-50 rounded-[999px]">
                        <div className="flex flex-col bg-red-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                        <p className="text-xs font-semibold leading-4 text-center text-red-800">
                          SCOPE 2
                        </p>
                      </div>
                      <p className="text-xs font-light text-gray-700">
                        The result of activities that produce energy that the
                        company then consumes
                      </p>
                    </CardHeader>
                    <CardContent className="p-0 pt-3">
                      <div className="flex justify-between items-center font-bold py-6">
                        <p className="text-xs">TOTAL tCO2e</p>
                        <p className="text-lg text-green-900">
                          {dashboard?.totalScope2EmissionForAllFacilities}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {dashboard?.finalResults?.map((item: any) => (
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold text-slate-700">
                              {item.facilityName}
                            </p>
                            <p className="text-green-900 text-xs">
                              {item.totalScope2TotalEmission || "Not Available"}
                            </p>
                          </div>
                        ))}
                        {/* {emissions?.length > 2 && (
                            <p className="font-bold">...</p>
                          )} */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="p-4">
                    <CardHeader className="border-b p-0 pb-3 space-y-3">
                      <div className="flex gap-3 justify-center items-stretch w-fit px-6 py-2 my-auto bg-green-100 bg-opacity-50 rounded-[999px]">
                        <div className="flex flex-col bg-green-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                        <p className="text-xs font-semibold leading-4 text-center text-green-800">
                          SCOPE 3
                        </p>
                      </div>
                      <p className="text-xs font-light text-gray-700">
                        Emissions associated with your organization&apos;s value
                        chain
                      </p>
                    </CardHeader>
                    <CardContent className="p-0 pt-3">
                      <div className="flex justify-between items-center font-bold py-6">
                        <p className="text-xs">TOTAL tCO2e</p>
                        <p className="text-lg text-green-900">
                          {dashboard?.totalScope3EmissionForAllFacilities}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {dashboard?.finalResults?.map((item: any) => (
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold text-slate-700">
                              {item.facilityName}
                            </p>
                            <p className="text-green-900 text-xs">
                              {item.totalScope3TotalEmission || "Not Available"}
                            </p>
                          </div>
                        ))}
                        {/* {emissions?.length > 2 && (
                            <p className="font-bold">...</p>
                          )} */}
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TotalEmissionsSummary;
