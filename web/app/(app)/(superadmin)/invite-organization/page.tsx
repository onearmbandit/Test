"use client";
import AutocompleteInput from "@/components/Autocomplete";
import { Input } from "@/components/ui/input";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { updatePassword } from "@/services/user.api";
import { toast } from "sonner";
import { getAllOrganizations } from "@/services/organizations.api";

const InviteOrganization = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["account-details"],
    queryFn: () => getAllOrganizations(),
  });

  console.log("org data : ", data?.data);

  const validation = z.object({
    firstName: z
      .string()
      .min(8, { message: "length" })
      .regex(/[A-Z]/, { message: "uppercase" })
      .regex(/[a-z]/, { message: "lowercase" })
      .regex(/[0-9]/, { message: "number" })
      .regex(/[^A-Za-z0-9]/, { message: "special" }),
    lastName: z
      .string()
      .min(8, { message: "length" })
      .regex(/[A-Z]/, { message: "uppercase" })
      .regex(/[a-z]/, { message: "lowercase" })
      .regex(/[0-9]/, { message: "number" })
      .regex(/[^A-Za-z0-9]/, { message: "special" }),
    email: z
      .string()
      .min(8, { message: "length" })
      .regex(/[A-Z]/, { message: "uppercase" })
      .regex(/[a-z]/, { message: "lowercase" })
      .regex(/[0-9]/, { message: "number" })
      .regex(/[^A-Za-z0-9]/, { message: "special" }),
    companyName: z
      .string()
      .min(8, { message: "length" })
      .regex(/[A-Z]/, { message: "uppercase" })
      .regex(/[a-z]/, { message: "lowercase" })
      .regex(/[0-9]/, { message: "number" })
      .regex(/[^A-Za-z0-9]/, { message: "special" }),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["user-details"],
    mutationFn: updatePassword,
    onSuccess: (data) => {
      console.log("after update : ", data);
      toast.success("Password updated successfully", {
        style: { color: "green" },
      });
      // setMyAccSection("home");
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const inviteOrganizationForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
    },
    // validateOnChange: false,
    // validationSchema: toFormikValidationSchema(validation),

    onSubmit: (data: any) => {
      console.log("data : ", data);
      // mutate(data);
    },
  });
  console.log(inviteOrganizationForm.errors);

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gray-50 absolute inset-0">
      <img src="/assets/images/Logo.svg" className="p-4" />
      <section className="flex flex-col justify-center items-stretch px-11 py-8 bg-white rounded max-w-[50rem] w-full max-md:px-5">
        <header className="text-2xl font-semibold leading-8 text-center text-slate-700 max-md:max-w-full">
          Invite Organization
        </header>
        <form
          onSubmit={inviteOrganizationForm.handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="firstNameInput"
            >
              First Name
            </label>
            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <Input
                type="text"
                id="firstNameInput"
                placeholder="First Name"
                name="firstName"
                onChange={inviteOrganizationForm.handleChange}
                className="bg-transparent"
              />
            </div>
          </div>
          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="lastNameInput"
            >
              Last Name
            </label>
            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <Input
                type="text"
                id="lastNameInput"
                placeholder="Last Name"
                name="lastName"
                onChange={inviteOrganizationForm.handleChange}
                className="bg-transparent"
              />
            </div>
          </div>

          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="emailInput"
            >
              Email
            </label>
            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <Input
                type="email"
                id="emailInput"
                placeholder="Email"
                name="email"
                onChange={inviteOrganizationForm.handleChange}
                className="bg-transparent"
              />
            </div>
          </div>

          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="companyNameInput"
            >
              Company Name
            </label>

            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <Select
                name="companyName"
                onValueChange={inviteOrganizationForm.handleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select or add a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Companies</SelectLabel>

                    {!isLoading &&
                      data?.data?.map((org: any, index: number) => (
                        <SelectItem key={org?.id} value={org?.company_name}>
                          {org?.company_name}
                        </SelectItem>
                      ))}

                    {/* <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem> */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            className="justify-center items-stretch self-center px-4 py-1.5 mt-8 text-sm font-semibold leading-5 text-white whitespace-nowrap bg-blue-600 rounded"
            aria-label="Invite to Terralab"
            type="submit"
          >
            Invite to Terralab
          </button>
        </form>
      </section>
    </div>
  );
};

export default InviteOrganization;
