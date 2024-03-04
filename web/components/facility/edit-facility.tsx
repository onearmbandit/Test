"use client";

import React, { useState } from "react";
import AutocompleteInput from "../Autocomplete";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFacility, updateFacility } from "@/services/facility.api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser } from "@/services/user.api";

const EditFacility = ({
  serialNo = 1,
  facility,
}: {
  serialNo?: number;
  facility: any;
}) => {
  // const { data: session } = useSession();
  const router = useRouter();

  const userQ = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data.data : {};

  const orgId = user?.organizations[0].id;

  const [isEdit, setEdit] = useState(false);

  const validation = z.object({
    name: z
      .string()
      .min(5, { message: "Name should be minimum of 5 characters" })
      .max(255, { message: "Name should be less than 255 characters" }),
    address: z
      .string()
      .min(5, { message: "Address should be minimum of 5 characters" })
      .max(500, { message: "Address should be less than 500 characters" }),
  });

  const { mutate } = useMutation({
    mutationFn: updateFacility,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      toast.success("Facility is updated", { style: { color: "green" } });
      router.push("/facilities");
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const { values, handleSubmit, handleChange, errors, setFieldValue } =
    useFormik({
      initialValues: {
        name: facility.name,
        address: facility.address,
      },
      validateOnBlur: true,
      validateOnChange: false,
      validationSchema: toFormikValidationSchema(validation),
      onSubmit: (data) => {
        mutate({ id: facility.id, obj: data });
      },
    });

  return (
    <section className="justify-center items-stretch self-stretch border border-[color:var(--Slate-200,#E2E8F0)] bg-white flex flex-col p-6 rounded-lg border-solid max-md:px-5">
      <header className="items-stretch flex justify-between gap-5 py-0.5 max-md:max-w-full max-md:flex-wrap">
        <div className="text-gray-700 text-xs font-semibold leading-4 flex justify-center items-center bg-gray-100 aspect-square h-5 w-5 my-auto px-2 rounded-full">
          {serialNo}
        </div>
        <h1
          className="text-slate-800 text-ellipsis text-lg font-medium leading-7 grow max-md:max-w-full"
          aria-label="Add new facility"
          role="heading"
        >
          {facility.name}
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="items-stretch gap-5 mt-8 px-16 max-md:max-w-full max-md:flex-wrap max-md:px-5"
      >
        <div className="flex space-x-7">
          <label
            className="text-slate-700 text-xs font-medium leading-4 whitespace-nowrap my-auto"
            htmlFor="facility-name"
          >
            Facility Name
          </label>
          <div>
            <Input
              id="facility-name"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              className={cn(
                "text-slate-500 text-sm font-light leading-4 whitespace-nowrap max-w-[18.5rem] bg-gray-50  justify-center pl-2 pr-8 py-3.5 rounded-md max-md:pr-5",
                errors.name && "border border-red-500"
              )}
              placeholder="Add facility name"
            />
            <p className="text-xs text-red-500">{errors.name as string}</p>
          </div>
        </div>
        <div className="flex justify-between items-end mb-3 py-3">
          <p
            className="justify-center self-center text-slate-700 text-xs font-medium leading-4 mt-10 max-md:max-w-full"
            aria-label="Facility Location"
            role="text"
          >
            Facility Location
          </p>

          <p
            role="button"
            onClick={() => setEdit(true)}
            className="text-sm font-semibold text-blue-600 leading-4"
          >
            Edit
          </p>
        </div>
        <div className="min-h-[44px]">
          <AutocompleteInput
            isDisabled={!isEdit}
            setAddress={(e: any) => {
              setFieldValue("address", e);
            }}
            address={values.address}
          />
          <p className="text-xs text-red-500">{errors.address as string}</p>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            size={"sm"}
            className="text-center text-sm font-semibold leading-4 whitespace-nowrap mt-8 px-4 py-2 self-end"
          >
            Update Facility
          </Button>
        </div>
      </form>
    </section>
  );
};

export default EditFacility;
