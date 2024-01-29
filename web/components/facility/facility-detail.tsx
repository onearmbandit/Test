"use client";

import { ChevronDown, Plus } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion";

const FacilityDetails = () => {
  return (
    <div className="mt-5">
      <div className="flex justify-end">
        <p
          role="button"
          className="text-sm font-semibold flex gap-1 items-center text-blue-600 py-1"
        >
          <Plus size={16} /> Add Reporting Period
        </p>
      </div>

      <div className="mt-3">
        <Tabs>
          <TabsList className="border-b border-gray-200 w-full">
            <TabsTrigger value="acount">Account</TabsTrigger>
            <TabsTrigger value="vv">Accountvv</TabsTrigger>
          </TabsList>
          <TabsContent value="acount">
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
                <p className="text-xs font-light text-slate-700 mt-[1.88rem]">
                  Enter your reporting above. Then fill your scope 1, 2, and 3,
                  emissions for this facility within the reporting period.
                </p>
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
      </div>
    </div>
  );
};

export default FacilityDetails;
