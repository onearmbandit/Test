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

const ClimateCommitments = ({ climateTargets }: { climateTargets: any }) => {
  return (
    <div className="items-stretch bg-[#14532D0D] w-full flex flex-col rounded-lg">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="rounded-lg">
          <AccordionTrigger className="items-center bg-[#E3ECEC] flex w-full justify-between gap-5 px-4 py-3 rounded-md md:max-w-full md:flex-wrap">
            <div className="flex items-stretch justify-between gap-2">
              <Globe />
              <div className="text-green-950 text-xs font-medium leading-5 self-center grow whitespace-nowrap my-auto">
                Climate Commitments
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200" />
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="backdrop-blur-[2px] flex flex-wrap gap-5 mt-2 mb-1.5 px-8 py-3 rounded-lg max-md:max-w-full max-md:flex-wrap max-md:px-5">
              {climateTargets?.length > 0 &&
                climateTargets?.map((target: any, targetIndex: number) => (
                  <div
                    key={targetIndex}
                    className="text-white text-xs font-bold leading-4 whitespace-nowrap items-stretch shadow bg-teal-950  justify-center px-4 py-3 rounded-md"
                    role="button"
                  >
                    {target}
                  </div>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ClimateCommitments;
