"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";

const EditClimateConditions = () => {
  const router = useRouter();
  return (
    <form
      action={() => router.push("/edit-organisation")}
      className="items-start self-stretch bg-white flex grow rounded-e-lg flex-col space-y-6  pt-6 px-8 max-md:px-5"
      aria-label="Climate Commitments form"
    >
      <header className="text-blue-600 text-xs font-medium leading-5 self-stretch max-md:max-w-full">
        <span className="text-slate-500">
          {" "}
          Account &gt; Organization Account &gt;{" "}
        </span>
        <span className="text-blue-600">Edit Climate Commitments</span>
      </header>
      <h1 className="text-gray-700 text-lg font-bold leading-7 self-stretch mt-9 border-b border-gray-300  pb-3 max-md:max-w-full">
        Edit Climate Commitments
      </h1>

      <h2 className="self-stretch text-slate-700 text-base font-semibold leading-6 mt-6 max-md:max-w-full">
        Climate commitments
      </h2>
      <div className="rounded bg-gray-50 self-stretch flex gap-4 h-[5.875rem] p-[0.62rem] items-start max-md:max-w-full">
        <a
          href="#"
          className="justify-between items-stretch border border-green-100 bg-green-50 flex gap-0.5 px-2.5 py-2 rounded-md border-solid"
          aria-label="Carbon Neutral by 2030"
        >
          <div className="text-green-800 text-xs font-medium leading-4 grow whitespace-nowrap">
            Carbon Neutral by 2030
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/350c47cf364c5defbdd25bcb8143872f3b6e1ea2d3683ceceeaa6a6729f9787b?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-square object-contain object-center w-3 overflow-hidden self-center shrink-0 max-w-full my-auto"
            alt="Carbon Neutral"
          />
        </a>
        <a
          href="#"
          className="justify-between items-stretch border border-green-100 bg-green-50 flex gap-0.5 px-2.5 py-2 rounded-md border-solid"
          aria-label="Carbon Neutral by 2030"
        >
          <div className="text-green-800 text-xs font-medium leading-4 grow whitespace-nowrap">
            Carbon Neutral by 2030
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/350c47cf364c5defbdd25bcb8143872f3b6e1ea2d3683ceceeaa6a6729f9787b?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-square object-contain object-center w-3 overflow-hidden self-center shrink-0 max-w-full my-auto"
            alt="Carbon Neutral"
          />
        </a>
      </div>
      <Input
        id="employees"
        className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
        placeholder="ex: Carbon neutral by 2030"
      />

      <div
        className="flex w-[153px] max-w-full flex-col items-end mt-8 mb-7 self-end"
        aria-label="Add Target and Save Changes"
      >
        <div className="text-blue-600 text-center text-sm font-bold leading-4 whitespace-nowrap">
          + Add another target
        </div>
        <Button
          className="text-center text-sm font-bold leading-4 whitespace-nowrap mt-8 max-w-[8.125rem]"
          type="submit"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EditClimateConditions;
