"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Tick from "../icons/Tick";
import { ChevronDown } from "lucide-react";
import { formatAddress } from "@/lib/utils";
import EditAddress from "../popups/organisation/edit-address";
import EditFacility from "./edit-facility";
import { useRouter, useSearchParams } from "next/navigation";

const FacilitiesList = ({ facilities }: any) => {
  const [selectedEdit, setSelectedEdit] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const editFacility = searchParams.get("edit") || 0;

  return (
    <Accordion type="single" className="space-y-3" collapsible>
      {facilities.map((item: any, i: number) =>
        editFacility == i + 1 ? (
          <EditFacility serialNo={i + 1} facility={item} />
        ) : (
          <AccordionItem
            value={item.id}
            className="items-stretch self-stretch border border-slate-200] bg-white flex flex-col text-xs p-6 rounded-lg border-solid max-md:px-5"
          >
            <AccordionTrigger className="items-center flex py-0.5 max-md:max-w-full max-md:flex-wrap">
              <div className="flex gap-5 items-center">
                <Tick variant="blue" />
                <h1 className="text-slate-800 text-ellipsis text-lg font-medium leading-7 max-md:max-w-full">
                  {item.name}
                </h1>
              </div>
              <ChevronDown size={16} className="text-slate-500" />
            </AccordionTrigger>
            <AccordionContent>
              <h2 className="text-slate-700 font-medium leading-[133%] mt-8 max-md:max-w-full">
                Facility Location
              </h2>
              <p className="text-green-900 leading-4 mt-4 max-md:max-w-full">
                {item.address.split("\n").map((line: string) => (
                  <>
                    {line}
                    <br />
                  </>
                ))}
              </p>
              <form
                className="flex flex-col text-sm text-blue-600 font-semibold text-center mt-8 pl-20 py-2 items-end max-md:max-w-full max-md:pl-5"
                aria-label="Facility Options"
                aria-role="form"
              >
                <p className="leading-[114%] whitespace-nowrap">
                  View / Add Emissions
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/facilities?edit=${i + 1}`)}
                  className="leading-[114%] mt-7"
                >
                  Edit
                </button>
              </form>
            </AccordionContent>
          </AccordionItem>
        )
      )}
    </Accordion>
  );
};

export default FacilitiesList;
