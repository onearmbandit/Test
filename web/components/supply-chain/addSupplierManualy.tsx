"use client";
import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import AutocompleteInput from "../Autocomplete";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

import { useFormik } from "formik";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { addSupplier, getReportingPeriodById } from "@/services/supply.chain";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn, formatReportingPeriod } from "@/lib/utils";
import { report } from "process";

export const AddSupplierManualy = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportingId = searchParams.get("reportingId");

  const [edit, setEdit] = useState(false);

  const reportingPeriodQ = useQuery({
    queryKey: ["reporting-period", reportingId],
    queryFn: () => getReportingPeriodById(reportingId ? reportingId : ""),
  });

  const reportingPeriod = reportingPeriodQ.isSuccess
    ? reportingPeriodQ.data.data
    : null;

  console.log(reportingPeriod, "reporting period");

  const relationShips = ["OWNED", "CONTRACTED"];

  const validation = z.object({
    supplyChainReportingPeriodId: z.string(),
    name: z.string(),
    email: z.string().email(),
    organizationRelationship: z.string(),
    address: z.string(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addSupplier,
    onSuccess: (data) => {
      console.log(data);

      toast.success("New Supplier Added", { style: { color: "green" } });
      setEdit(true);
      // router.push("/supply-chain");
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const { values, handleSubmit, handleChange, errors, setFieldValue } =
    useFormik({
      initialValues: {
        supplyChainReportingPeriodId: reportingId,
        name: "",
        email: "",
        organizationRelationship: "",
      },
      validateOnBlur: true,
      validateOnChange: false,
      validationSchema: toFormikValidationSchema(validation),
      onSubmit: (data) => {
        console.log("add supplier : ", data);
        mutate(data);
      },
    });

  return (
    <div className="flex flex-col flex-start p-6 w-full">
      <header className="flex gap-2.5 self-stretch p-3 text-sm leading-5 text-blue-600 max-md:flex-wrap">
        <ChevronLeft size={24} className="text-slate-500" />
        <div className="flex-auto max-md:max-w-full">
          <p className="text-slate-500">
            Supply Chain &gt;
            <span className="font-bold text-blue-600">Add Supplier</span>
          </p>
        </div>
      </header>

      <div className="flex gap-5 justify-between px-[40px] self-stretch max-md:flex-wrap">
        <div className=" text-lg font-bold leading-7 text-center text-gray-700">
          New Supplier Entry
        </div>
        <div className="justify-center px-2 py-0.5 my-auto text-xs font-medium leading-4 text-cyan-800 whitespace-nowrap bg-cyan-50 rounded-md">
          Reporting Period:{" "}
          {reportingPeriod &&
            formatReportingPeriod(
              reportingPeriod?.reporting_period_from,
              reportingPeriod.reporting_period_to
            )}
        </div>
      </div>
      <div className="text-sm leading-5 text- w-full px-[40px]  text-slate-800">
        <p className="py-8">
          Add your suppliers product carbon footprint to determine your product
          level contribution
        </p>
      </div>

      <div className="flex flex-col self-stretch py-6 mx-10 rounded border border-solid border-[color:var(--Gray-200,#E5E7EB)]">
        <div className="flex flex-col px-6 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex gap-2.5 self-start max-md:flex-wrap max-md:max-w-full">
            <div className="justify-center items-center px-2 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]">
              1
            </div>
            <div className="grow text-base font-bold leading-6 text-slate-800 max-md:max-w-full">
              Supplier Information
            </div>
          </div>

          {edit && edit ? <div> Yes </div> : <div> No </div>}
          <div className="mt-6 text-sm leading-5  text-slate-800 max-md:max-w-full">
            Add the basic information about your supplier
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-5 justify-between pr-20 mt-6 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
              <div className=" my-auto font-medium text-slate-700">
                Supplier Name
              </div>
              <Input
                name="name"
                onChange={handleChange}
                className="grow justify-center bg-gray-50 text-slate-700 max-md:pr-5"
              />
            </div>

            <div className="flex gap-5 justify-between self-stretch pr-20 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5">
              <div className=" my-auto font-medium text-slate-700">
                Contact Email{" "}
              </div>
              <Input
                name="email"
                onChange={handleChange}
                className="grow justify-center py-3.5 pr-8 pl-2 bg-gray-50 rounded-md text-slate-700 max-md:pr-5"
              />
            </div>

            <div className="flex gap-5 justify-between pr-20 mt-6 text-xs max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
              <div className="my-auto font-medium leading-4 text-slate-700">
                Relationship <br />
                to organization
              </div>
              <div className="flex gap-2 justify-between px-2 whitespace-nowrap text-slate-700">
                <Select
                  value={values.organizationRelationship}
                  onValueChange={(e) => {
                    console.log("value changed : ", e);
                    setFieldValue("organizationRelationship", e);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "text-slate-500 text-sm font-light leading-5  bg-gray-50  mt-3 px-2 py-6 rounded-md max-md:max-w-full",
                      errors?.organizationRelationship &&
                        "border border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select relation to organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="text-sm">
                      {relationShips?.map((rel: string, index: number) => (
                        <SelectItem key={index} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-5 justify-between mt-6 max-md:flex-wrap max-md:max-w-full">
              <div className="grow text-xs font-medium leading-4 text-slate-700 max-md:max-w-full">
                Supplier Address
              </div>
              <div className="my-auto text-sm font-semibold leading-4 text-center text-blue-600">
                Edit
              </div>
            </div>
            <AutocompleteInput
              setAddress={(a: string) => {
                /** TODO: add the autocompleted address */
                setFieldValue("address", a);
                console.log(a, "address");
                console.log("first");
              }}
            />

            <button
              type="submit"
              className="justify-center self-end px-4 py-2 mt-6 mr-6 text-sm font-semibold leading-4 text-center text-blue-600 whitespace-nowrap rounded border-2 border-solid aspect-[2.03] border-[color:var(--Accent-colors-Sparkle---Active,#2C75D3)] max-md:mr-2.5"
            >
              Save
            </button>
          </form>
        </div>

        <div className="edit-section">
          <div className="flex gap-5 justify-between self-stretch pb-1.5 max-md:flex-wrap">
            <div className="flex gap-2.5 self-start px-5 text-base font-bold leading-6 text-slate-800 max-md:flex-wrap max-md:max-w-full">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/552d063641276c4b19d2c1033b6c711bc8c7c753d57dad4f762bb9bd3533b3c3?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                className="my-auto w-5 aspect-square"
              />
              <div className="grow max-md:max-w-full">Supplier Information</div>
            </div>
            <div className="text-sm font-semibold leading-5 text-blue-600">
              Edit
            </div>
          </div>
          <div className="text-xs font-medium leading-5 text-green-900 px-5 max-w-[515px]">
            <p className="text-slate-500">
              Supplier Name: <span className="text-green-900">Supplier </span>
            </p>
            <br />
            <span className="text-slate-500">Contact Email:</span>
            <span className="text-green-900"> contact@supplier.com</span>
            <br />
            <span className="text-slate-500">
              Relationship to Organization:{" "}
            </span>
            <span className="text-green-900">Contracted</span>
            <br />
            <span className="text-slate-500">Supplier Address:</span>{" "}
            <span className="text-green-900">
              Eastern Parkway, Floor 2, Brooklyn, NY, 11223, United States of
              America
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col self-stretch p-6 rounded border border-solid mx-10 my-8 border-[color:var(--Gray-200,#E5E7EB)] max-md:px-5">
        <div className="flex gap-2.5 justify-between max-md:flex-wrap max-md:max-w-full">
          <div className="justify-center items-center px-1.5 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]">
            2
          </div>
          <div className="flex-auto text-base font-bold leading-6 text-slate-800 max-md:max-w-full">
            Product & Product Level Contribution
          </div>
        </div>
        <div className="mt-6 text-sm leading-5 text-slate-800 max-md:max-w-full">
          Enter the product type, product name, units created each year, and the
          functional unit associated with the product.
        </div>
      </div>
    </div>
  );
};
export default AddSupplierManualy;
