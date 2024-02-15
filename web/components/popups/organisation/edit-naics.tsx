"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { setupOrganizationStep3 } from "@/services/organizations.api";
import { getUser } from "@/services/user.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const EditNaics = ({ setSection }: { setSection: (val: string) => void }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const orgId = session?.user.organizations[0].id!;

  const userQ = useQuery({
    queryKey: ["naics-details"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data : null;

  const { mutate, isPending } = useMutation({
    mutationFn: setupOrganizationStep3,
    onSuccess: (organization) => {
      toast.success("Your organization profile has been updated", {
        style: { color: "green" },
      });
      queryClient.invalidateQueries({ queryKey: ["account-details"] });
      setSection("home");
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const validation = z.object({
    naicsCode: z
      .string()
      .regex(/^[0-9]{4,5}$/, "Please enter a valid NAICS code"),
  });

  const naicsForm = useFormik({
    initialValues: {
      naicsCode: "",
    },
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data) => {
      console.log(data);
      mutate({
        id: orgId,
        formdata: data,
      });
    },
  });

  useEffect(() => {
    if (userQ.isSuccess) {
      const naics = user.data.organizations[0].naics_code;
      console.log(naics);
      naicsForm.setFieldValue("naicsCode", naics);
    }
  }, [userQ.status]);
  return (
    <form
      onSubmit={naicsForm.handleSubmit}
      className="items-start self-stretch grow bg-white flex rounded-e-lg space-y-6 flex-col pt-6 px-8 max-md:px-5"
    >
      <header className="text-blue-600 text-xs font-medium leading-5 self-stretch mr-2.5 max-md:max-w-full">
        <span className="text-slate-500">
          {" "}
          Account &gt;{" "}
          <span onClick={() => setSection("home")} role="button">
            Organization Account
          </span>{" "}
          &gt;
        </span>{" "}
        <span className="text-blue-600">Edit NAICS Code</span>
      </header>

      <h2 className="text-gray-700 text-lg font-bold leading-7 self-stretch mr-2.5 pb-3 border-b border-gray-300  max-md:max-w-full">
        Edit NAICS Code
      </h2>

      <div className="text-slate-700 text-base font-semibold leading-6 self-stretch max-md:max-w-full">
        <label htmlFor="employees">NAICS Code</label>
      </div>
      <div className="w-full">
        <Input
          id="employees"
          onChange={naicsForm.handleChange}
          name="naicsCode"
          value={naicsForm.values.naicsCode}
          className={cn(
            "py-2 h-11 rounded-md bg-gray-50 text-sm w-1/2 leading-4 font-light text-slate-700",
            naicsForm.errors.naicsCode && "border border-red-500"
          )}
          placeholder="3241"
        />
        <p className="text-red-500 text-xs">{naicsForm.errors?.naicsCode}</p>
      </div>

      <Button
        className="text-sm font-bold whitespace-nowrap justify-center items-stretch rounded self-end"
        type="submit"
      >
        Save Changes
      </Button>
    </form>
  );
};

export default EditNaics;
