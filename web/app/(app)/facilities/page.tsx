import AutocompleteInput from "@/components/Autocomplete";
import FacilityEmissionsSummary from "@/components/FacilityEmissionsSummary";
import AddFacility from "@/components/facility/add-facility";
import Tick from "@/components/icons/Tick";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFacilities } from "@/services/facility.service";
import { ChevronDown, ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { ReadonlyURLSearchParams } from "next/navigation";
import React, { useState } from "react";

const Page = async ({ searchParams }: { searchParams: any }) => {
  const { data: facilities } = await getFacilities();

  return (
    <div className="p-6 bg-white w-full">
      {/* Nav */}
      <div className="items-center self-stretch flex gap-2.5 pl-3 py-3 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <nav className="text-blue-700 text-sm leading-5 justify-center items-stretch grow py-1.5 max-md:max-w-full">
          <a href="/" className="text-slate-500">
            Organization Profile
          </a>{" "}
          &gt;{" "}
          <a href="?pepsiCoFacilities" className="text-slate-500">
            Pepsi Co&apos;s Facilities
          </a>{" "}
          &gt;{" "}
          <a
            href="/facility1"
            className="font-bold text-blue-700"
            aria-label="Facility 1"
            role="link"
          >
            Facility 1
          </a>
        </nav>
      </div>

      <div className="mt-3 space-y-3">
        <h2 className="text-slate-800 text-ellipsis whitespace-nowrap text-lg font-bold leading-7 max-w-[73px]">
          Facility 1
        </h2>

        <Accordion type="single">
          <AccordionItem
            value="item-1"
            className="items-stretch self-stretch border border-slate-200] bg-white flex flex-col text-xs p-6 rounded-lg border-solid max-md:px-5"
          >
            <AccordionTrigger className="items-center flex py-0.5 max-md:max-w-full max-md:flex-wrap">
              <div className="flex gap-5 items-center">
                <Tick variant="blue" />
                <h1 className="text-slate-800 text-ellipsis text-lg font-medium leading-7 max-md:max-w-full">
                  Facility 1
                </h1>
              </div>
              <ChevronDown size={16} className="text-slate-500" />
            </AccordionTrigger>
            <AccordionContent>
              <h2 className="text-slate-700 font-medium leading-[133%] mt-8 max-md:max-w-full">
                Facility Location
              </h2>
              <p className="text-green-900 leading-4 mt-4 max-md:max-w-full">
                Eastern Parkway, <br /> Floor 2, <br /> Brooklyn, NY, 11223,{" "}
                <br /> United States of America{" "}
              </p>
              <form
                className="flex flex-col text-sm text-blue-600 font-semibold text-center mt-8 pl-20 py-2 items-end max-md:max-w-full max-md:pl-5"
                aria-label="Facility Options"
                aria-role="form"
              >
                <a href="#" className="leading-[114%] whitespace-nowrap">
                  View / Add Emissions
                </a>
                <button className="leading-[114%] mt-7">Edit</button>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {searchParams["add-new"] == "true" && <AddFacility />}

        <Link
          href={"/facilities?add-new=true"}
          className="gap-1.5 text-sm font-semibold text-blue-600 rounded border-2 flex w-fit items-center ml-auto border-blue-600 px-4 py-1"
        >
          <Plus size={16} className="text-blue-600" />
          Add New Facility
        </Link>
      </div>
    </div>
  );
};

export default Page;
