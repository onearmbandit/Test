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
import { getRoleByName, updatePassword } from "@/services/user.api";
import { toast } from "sonner";
import {
  getAllOrganizations,
  inviteOrganization,
} from "@/services/organizations.api";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const InviteOrganization = () => {
  const { data: session } = useSession();
  const organizationsQ = useQuery({
    queryKey: ["organizations"],
    queryFn: () => getAllOrganizations(),
  });
  const organizations = organizationsQ.isSuccess ? organizationsQ.data : [];

  const roleQ = useQuery({
    queryKey: ["role"],
    queryFn: () => getRoleByName({ roleName: "admin" }),
  });
  const role = roleQ.isSuccess ? roleQ.data : null;

  console.log(role);

  const validation = z.object({
    first_name: z.string().min(3, { message: "length" }),
    last_name: z.string().min(3, { message: "length" }),
    email: z.string().email({ message: "Please enter valid email" }),
    organization_id: z.string(),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["user-details"],
    mutationFn: inviteOrganization,
    onSuccess: (data) => {
      toast.success("Invitation sent successfully", {
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
      first_name: "",
      last_name: "",
      email: "",
      organization_id: null,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: toFormikValidationSchema(validation),

    onSubmit: (data: any) => {
      const formData = {
        ...data,
        role_id: role?.data?.id,
        invited_by: session?.user.id,
      };
      console.log("data : ", formData);
      mutate(formData);
    },
  });
  console.log();

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
            <div
              className={cn(
                "text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full",
                inviteOrganizationForm.errors?.first_name &&
                  "border border-red-500"
              )}
            >
              <Input
                type="text"
                id="firstNameInput"
                placeholder="First Name"
                name="first_name"
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
            <div
              className={cn(
                "text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full",
                inviteOrganizationForm.errors?.last_name &&
                  "border border-red-500"
              )}
            >
              <Input
                type="text"
                id="lastNameInput"
                placeholder="Last Name"
                name="last_name"
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
            <div
              className={cn(
                "text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full",
                inviteOrganizationForm.errors?.email && "border border-red-500"
              )}
            >
              <Input
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

            <div
            // className={cn(
            //   "text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full",
            //   inviteOrganizationForm.errors?.organization_id &&
            //     "border border-red-500"
            // )}
            >
              <Select
                name="organizationId"
                onValueChange={(e) => {
                  inviteOrganizationForm.setFieldValue("organization_id", e);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "text-slate-500 text-sm font-light leading-5  bg-gray-50  mt-3 px-2 py-6 rounded-md max-md:max-w-full",
                    inviteOrganizationForm.errors?.organization_id &&
                      "border border-red-500"
                  )}
                >
                  <SelectValue placeholder="Select or add a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Add or select a company</SelectLabel>

                    {organizationsQ.isSuccess &&
                      organizations?.data?.map((org: any, index: number) => (
                        <SelectItem key={org?.id} value={org?.id}>
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

          <div className="flex justify-center items-center">
            {isPending && <Loader2 className="animate-spin text-blue-400" />}
            <Button
              disabled={isPending}
              className="text-sm font-semibold leading-5  whitespace-nowrap "
              aria-label="Invite to Terralab"
              type="submit"
            >
              Invite to Terralab
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default InviteOrganization;
