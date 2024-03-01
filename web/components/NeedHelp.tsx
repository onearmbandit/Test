"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllFacilityProductNames } from "@/services/facility.api";

const NeedHelp = ({ facility, user }: any) => {
  const [open, setOpen] = useState<string>("item-1");
  const facilities = facility?.data;

  const orgId = user?.organizations[0]?.id;

  const productNamesQ = useQuery({
    queryKey: ["product-names", orgId],
    queryFn: () => getAllFacilityProductNames(orgId),
    enabled: facilities?.length > 0,
  });

  const productNames = productNamesQ.isSuccess ? productNamesQ.data?.data : [];

  const step1 = facilities?.length > 0;
  const step2 =
    facilities?.length > 0
      ? facilities[facilities?.length - 1]?.facilityEmission?.length > 0
      : false;
  const step3 = productNamesQ.isSuccess ? productNames?.length : 0;

  if (step1 && step2 && step3 > 0) {
    return null;
  }

  return (
    <div className="w-full mt-[0.625rem]">
      <Accordion type="single" value={open} collapsible>
        <AccordionItem
          value="item-1"
          className="rounded-lg border border-slate-100 pb-0"
        >
          <AccordionTrigger
            onClick={() =>
              open == "item-1" ? setOpen("item-0") : setOpen("item-1")
            }
            className="flex space-x-4 justify-normal p-6 rounded-lg border-none bg-green-50 [&[data-state=open]>p]:opacity-0"
          >
            <ChevronDown className="h-6 w-6 text-slate-500 shrink-0 transition-transform duration-200" />
            <p className="text-lg font-bold text-gray-700 transition-opacity duration-200">
              Need help? <span className="text-blue-600">Click here</span> to
              learn how to set up your Terralab dashboard
            </p>
          </AccordionTrigger>
          <AccordionContent className="rounded-b-lg border-none">
            <section className="items-center bg-green-50 p-6 flex flex-col rounded-xl border-solid max-md:px-5">
              <h1 className="text-gray-700 text-center text-xl font-semibold leading-7 self-stretch max-md:max-w-full">
                Welcome to Terralab. Let&apos;s make sustainability a seamless
                part of your business.
              </h1>
              <p className="text-gray-700 text-center text-xl leading-7 self-stretch mt-4 max-md:max-w-full">
                Follow these steps to add your organization&apos;s carbon
                emissions
              </p>
              <article className="items-stretch shadow-lg bg-white self-center flex w-full max-w-[947px] flex-col mt-4 pl-10 pr-6 py-11 rounded-[31.229px] max-md:max-w-full max-md:px-5">
                <div className="max-md:max-w-full">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    {/* step 1 */}
                    <div
                      className="steps flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0"
                      role="navigation"
                    >
                      <div className="step-items items-stretch flex gap-3">
                        <div className="h-full flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full grid place-items-center",
                              step1 ? "bg-[#2C75D3]" : "bg-gray-100"
                            )}
                          >
                            {step1 ? (
                              <Check size={16} className="text-white" />
                            ) : (
                              <p className="text-xs font-semibold text-gray-700">
                                1
                              </p>
                            )}
                          </div>
                          <div
                            className={cn(
                              "h-full w-1 flex-1 rounded-full",
                              step1 ? "bg-[#2C75D3]" : "bg-gray-200"
                            )}
                          />
                        </div>
                        <div className="items-stretch flex grow flex-col pb-6">
                          <p className="text-slate-900 text-sm font-medium leading-5 whitespace-nowrap">
                            Step 1: Add a new facility
                          </p>
                          <p className="text-gray-500 text-sm leading-5">
                            Begin by adding your facility. You can add multiple
                            facilities to your organization
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* step 2 */}
                    <div
                      className="steps flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0"
                      role="navigation"
                    >
                      <div className="step-items items-stretch flex gap-3">
                        <div className="h-full flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full grid place-items-center",
                              step2 ? "bg-[#2C75D3]" : "bg-gray-100"
                            )}
                          >
                            {step2 ? (
                              <Check size={16} className="text-white" />
                            ) : (
                              <p className="text-xs font-semibold text-gray-700">
                                2
                              </p>
                            )}
                          </div>
                          <div
                            className={cn(
                              "h-full w-1 flex-1 rounded-full",
                              step2 ? "bg-[#2C75D3]" : "bg-gray-200"
                            )}
                          />
                        </div>
                        <div className="items-stretch flex grow flex-col pb-6">
                          <p className="text-slate-900 text-sm font-medium leading-5 whitespace-nowrap">
                            Step 2: Update Emissions
                          </p>
                          <p className="text-gray-500 text-sm leading-5">
                            Add your facilities reporting period and update the
                            Scope 1, 2, and 3 emissions for your facility. You
                            can always change or add these later.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* step 3 */}
                    <div
                      className="steps flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0"
                      role="navigation"
                    >
                      <div className="step-items items-stretch flex gap-3">
                        <div className="h-full flex flex-col items-center gap-1">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full grid place-items-center",
                              step3 > 0 ? "bg-[#2C75D3]" : "bg-gray-100"
                            )}
                          >
                            {step3 > 0 ? (
                              <Check size={16} className="text-white" />
                            ) : (
                              <p className="text-xs font-semibold text-gray-700">
                                2
                              </p>
                            )}
                          </div>
                          <div
                            className={cn(
                              "h-full w-1 flex-1 rounded-full",
                              step3 > 0 ? "bg-[#2C75D3]" : "bg-gray-200"
                            )}
                          />
                        </div>
                        <div className="items-stretch flex grow flex-col pb-6">
                          <p className="text-slate-900 text-sm font-medium leading-5 whitespace-nowrap">
                            Step 3: Add your Product Line
                          </p>
                          <p className="text-gray-500 text-sm leading-5">
                            Within each facilities reporting period associate
                            your product lines with their carbon footprint.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gap-5 grid grid-cols-3 mt-[0.62rem] place-items-center items-start">
                    <img
                      src={
                        "https://diw3xy9w4etxp.cloudfront.net/40feb0879e28e2b8137e851a93be7f93.png"
                      }
                      alt="welcome guide step-1"
                      width={195}
                      height={97}
                    />
                    <img
                      width={190}
                      height={153}
                      src={"/assets/images/welcome-step-2.png"}
                      alt="welcome guide step-2"
                    />
                    <img
                      width={241}
                      height={112}
                      src={"/assets/images/welcome-step-3.png"}
                      alt="welcome guide step-3"
                    />
                  </div>
                </div>
              </article>
              <p
                onClick={() => setOpen("item-0")}
                className="text-blue-600 text-center text-sm font-semibold cursor-pointer leading-4 self-center whitespace-nowrap mt-9"
              >
                Skip
              </p>
            </section>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default NeedHelp;
