import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

const TotalEmissionsSummary = () => {
  return (
    <div className="bg-white rounded-lg w-full mt-3">
      <Accordion type="single" collapsible>
        <AccordionItem value="total-emissions" className="px-16 py-6 border-0">
          <AccordionTrigger className="p-0 py-3 flex justify-between [&[data-state=open]>div>svg]:rotate-180">
            <div className="flex items-center">
              <ChevronDown size={16} className="text-slate-600 mr-6" />
              <p className="text-xl font-semibold text-gray-700 pl-3">
                Total Emissions Across Facilities
              </p>
            </div>
            <p className="text-sm font-bold text-green-950">22,142.16 tCO2e</p>
          </AccordionTrigger>
          <AccordionContent className="p-0">
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
                        <p className="text-lg text-green-900">{}</p>
                      </div>

                      <div className="space-y-3">
                        {/* {emissions?.map((item: any) => (
                            <div className="flex justify-between items-center">
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
                          {emissions?.length > 2 && (
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
                        <p className="text-lg text-green-900">{}</p>
                      </div>

                      <div className="space-y-3">
                        {/* {emissions?.map((item: any) => (
                            <div className="flex justify-between items-center">
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
                          {emissions?.length > 2 && (
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
                        <p className="text-lg text-green-900">{}</p>
                      </div>

                      <div className="space-y-3">
                        {/* {emissions?.map((item: any) => (
                            <div className="flex justify-between items-center">
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
                          {emissions?.length > 2 && (
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
