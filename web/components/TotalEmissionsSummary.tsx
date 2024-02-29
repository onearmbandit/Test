"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ChevronDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  getDashboardReportingPeriodList,
  getFacilityDashboard,
} from "@/services/facility.api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Select, SelectContent, SelectItem } from "./ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getUser } from "@/services/user.api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const options: ChartOptions<"bar"> = {
  indexAxis: "y" as const,
  elements: {
    bar: {
      borderRadius: 50,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
    },
  },
};

const labels = ["Scope 1", "Scope 2", "Scope 3"];

const TotalEmissionsSummary = () => {
  const [toFromDate, setToFromDate] = useState({
    from: "",
    to: "",
  });
  const [currentPeriod, setCurrentPeriod] = useState("all");

  const userQ = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data.data : { organizations: [] };

  const reporting = useQuery({
    queryKey: ["dashboard-reporting", user?.organizations[0]?.id],
    queryFn: () => getDashboardReportingPeriodList(user?.organizations[0]?.id!),
    enabled: userQ.isSuccess,
  });
  const reportingList = reporting.isSuccess ? reporting.data.data : [];

  const dashboardDetails = useQuery({
    queryKey: ["dashboard", toFromDate],
    queryFn: () =>
      getFacilityDashboard({
        from: toFromDate.from,
        to: toFromDate.to,
      }),
  });

  const dashboard = dashboardDetails.isSuccess
    ? dashboardDetails.data.data
    : {};

  const chartData = {
    labels,
    datasets: [
      {
        label: "Scope 1",
        data: [dashboard?.totalScope1EmissionForAllFacilities, 0, 0],
        backgroundColor: "#BBF7D0",
        barThickness: 20,
      },
      {
        label: "Scope 2",
        data: [0, dashboard?.totalScope2EmissionForAllFacilities, 0],
        backgroundColor: "#FED7AA",
        barThickness: 20,
      },
      {
        label: "Scope 3",

        data: [0, 0, dashboard?.totalScope3EmissionForAllFacilities],
        backgroundColor: "#BFDBFE",
        barThickness: 20,
      },
    ],
  };

  if (reportingList.length == 0) {
    return null;
  }

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
              <Select
                defaultValue={currentPeriod}
                onValueChange={(e) => {
                  if (e == "all") {
                    setToFromDate({
                      from: "",
                      to: "",
                    });
                    return;
                  }
                  const toFrom = reportingList.find(
                    (item: any) => item.reporting_period_from == e
                  );
                  setCurrentPeriod(e);
                  setToFromDate({
                    from: toFrom.reporting_period_from,
                    to: toFrom.reporting_period_to,
                  });
                }}
              >
                <SelectTrigger className="text-base border rounded flex space-x-2 items-center px-2 py-1">
                  <SelectValue placeholder="Reporting periods" />
                  <ChevronDown size={16} className="text-slate-600" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={"all"}
                    key={"all periods"}
                    className="text-sm"
                  >
                    All periods
                  </SelectItem>
                  {reportingList?.map((item: any) => (
                    <SelectItem
                      value={item.reporting_period_from}
                      key={item.reporting_period_from}
                      className="text-sm"
                    >
                      {dayjs(item.reporting_period_from).format("MM/YY")} -{" "}
                      {dayjs(item.reporting_period_to).format("MM/YY")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionTrigger>
          {dashboardDetails.isLoading && (
            <Loader2 className="text-blue-600 animate-spin" />
          )}
          {dashboardDetails.isSuccess && (
            <AccordionContent className="p-0 space-y-6">
              <div className="grid grid-cols-3 gap-[10px] h-[18.18rem]">
                <Card className="col-span-2 border-none shadow-md h-full">
                  <CardHeader>
                    <p className="font-bold text-lg">Scope Emissions</p>
                  </CardHeader>
                  <CardContent className="w-full h-[14rem] p-6 pt-3">
                    {dashboardDetails.isLoading && (
                      <Loader2 className="text-blue-600 animate-spin" />
                    )}
                    {dashboardDetails.isSuccess && (
                      <Bar data={chartData} options={options} />
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
                          {dashboard?.finalResults?.map(
                            (item: any, i: number) => (
                              <div
                                key={i}
                                className="flex justify-between items-center"
                              >
                                <p className="text-[10px] font-bold text-slate-700">
                                  {item.facilityName}
                                </p>
                                <p className="text-green-900 text-xs">
                                  {item.totalScope1TotalEmission ||
                                    "Not Available"}
                                </p>
                              </div>
                            )
                          )}
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
                          {dashboard?.finalResults?.map(
                            (item: any, i: number) => (
                              <div
                                key={i}
                                className="flex justify-between items-center"
                              >
                                <p className="text-[10px] font-bold text-slate-700">
                                  {item.facilityName}
                                </p>
                                <p className="text-green-900 text-xs">
                                  {item.totalScope2TotalEmission ||
                                    "Not Available"}
                                </p>
                              </div>
                            )
                          )}
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
                          Emissions associated with your organization&apos;s
                          value chain
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
                          {dashboard?.finalResults?.map(
                            (item: any, i: number) => (
                              <div
                                key={i}
                                className="flex justify-between items-center"
                              >
                                <p className="text-[10px] font-bold text-slate-700">
                                  {item.facilityName}
                                </p>
                                <p className="text-green-900 text-xs">
                                  {item.totalScope3TotalEmission ||
                                    "Not Available"}
                                </p>
                              </div>
                            )
                          )}
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
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TotalEmissionsSummary;
