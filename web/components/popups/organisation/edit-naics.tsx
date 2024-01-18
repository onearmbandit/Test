"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";

const EditNaics = ({ setSection }: { setSection: (val: string) => void }) => {
  const router = useRouter();
  return (
    <form
      action={() => setSection("home")}
      className="items-start self-stretch grow bg-white flex rounded-e-lg space-y-6 flex-col pt-6 px-8 max-md:px-5"
    >
      <header className="text-blue-600 text-xs font-medium leading-5 self-stretch mr-2.5 max-md:max-w-full">
        <span className="text-slate-500">
          {" "}
          Account &gt; Organization Account &gt;{" "}
        </span>{" "}
        <span className="text-blue-600">Edit NAICS Code</span>
      </header>

      <h2 className="text-gray-700 text-lg font-bold leading-7 self-stretch mr-2.5 pb-3 border-b border-gray-300  max-md:max-w-full">
        Edit NAICS Code
      </h2>

      <div className="text-slate-700 text-base font-semibold leading-6 self-stretch max-md:max-w-full">
        <label htmlFor="employees">NAICS Code</label>
      </div>
      <Input
        id="employees"
        className="py-2 h-11 rounded-md bg-gray-50 text-xs w-1/2 leading-4 font-light text-slate-700"
        placeholder="3241"
      />

      <Button
        className="text-sm font-bold whitespace-nowrap justify-center items-stretch rounded self-end"
        type="submit"
        aria-label="Save Changes"
      >
        Save Changes
      </Button>
    </form>
  );
};

export default EditNaics;
