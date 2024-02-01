"use client";
import AutocompleteInput from "@/components/Autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";

const EditAddress = ({ setSection }: { setSection: (val: string) => void }) => {
  const router = useRouter();

  const addressForm = useFormik({
    initialValues: {
      address: "",
    },
    onSubmit: (data) => {
      console.log(data);
      setSection("home");
    },
  });

  return (
    <form
      onSubmit={addressForm.handleSubmit}
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
        {/* <Input
          className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
          placeholder="New york"
        /> */}
        <div>
          <AutocompleteInput
            setAddress={(e: any) => {
              console.log("todo: set address" + e);
            }}
          />
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
