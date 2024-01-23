"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";

const EditAddress = ({ setSection }: { setSection: (val: string) => void }) => {
  const router = useRouter();
  return (
    <form
      action={() => setSection("home")}
      className="items-start w-full bg-white flex grow rounded-e-lg flex-col pl-8 pr-11 pt-6 pb-12 max-md:px-5"
    >
      <header className="text-blue-600 text-xs font-medium leading-5 self-stretch max-md:max-w-full">
        <span className="text-slate-500">
          Account &gt; Organization Account &gt;{" "}
        </span>
        <span className="text-blue-600">Edit NAICS code</span>
      </header>
      <h1 className="text-slate-700 text-lg font-bold leading-7 self-stretch mt-6 max-md:max-w-full">
        Edit Address
      </h1>
      <hr className="bg-gray-300 self-stretch shrink-0 h-px mt-2 max-md:max-w-full" />

      <div className="w-full space-y-6">
        <h2 className="text-slate-700 text-base font-semibold leading-6 self-stretch mt-6 max-md:max-w-full">
          Company Address
        </h2>
        <Input
          className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
          placeholder="New york"
        />
        <Input
          className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
          placeholder="8th floor"
        />
        <div className="items-stretch self-stretch flex flex-wrap justify-between gap-5 mt-6 pr-2.5 max-md:max-w-full">
          <a
            href="#"
            className="text-slate-700 text-xs font-light leading-4 whitespace-nowrap items-stretch bg-gray-50 grow justify-center px-2 py-3.5 rounded-md"
          >
            New York
          </a>
          <a
            href="#"
            className="items-stretch bg-gray-50 flex justify-between gap-2 px-2 py-3.5 rounded-md"
          >
            <div className="text-slate-700 text-xs font-light leading-4 grow whitespace-nowrap">
              New York
            </div>
            <img
              loading="lazy"
              className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full"
              alt="Address Image"
            />
          </a>
          <a
            href="#"
            className="text-slate-700 text-xs font-light leading-4 whitespace-nowrap items-stretch bg-gray-50 grow justify-center px-2 py-3.5 rounded-md"
          >
            10001-5748
          </a>
        </div>
        <div className="flex justify-end">
          <Button
            className="text-white text-center text-sm font-bold leading-4 whitespace-nowrap"
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditAddress;
