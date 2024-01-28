"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Globe from "./icons/Globe";
import { ChevronDown } from "lucide-react";

const FacilityEmissionsSummary = () => {
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
          <AccordionContent className="pb-0">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FacilityEmissionsSummary;
