"use client";
import AutocompleteInput from "@/components/Autocomplete";
import { Button } from "@/components/ui/button";
import { setupOrganizationStep1 } from "@/services/organizations.api";
import { getUser } from "@/services/user.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const EditAddress = ({ setSection }: { setSection: (val: string) => void }) => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);

  const queryClient = useQueryClient();
  const userQ = useQuery({
    queryKey: ["address-details"],
    queryFn: () => getUser(),
  });

  const user = userQ.isSuccess ? userQ.data?.data : null;

  const { mutate, isPending } = useMutation({
    mutationFn: setupOrganizationStep1,
    onSuccess: (data: any) => {
      toast.success("Address update Successully.", {
        style: { color: "green" },
      });
      queryClient.invalidateQueries({
        queryKey: ["address-details", "account-details"],
      });
      setSection("home");
    },
  });

  const addressForm = useFormik({
    initialValues: {
      companyAddress: "",
    },
    validationSchema: toFormikValidationSchema(
      z.object({
        companyAddress: z.string(),
      })
    ),
    validateOnBlur: true,
    onSubmit: (data) => {
      mutate({
        id: user?.organizations[0]?.id,
        formdata: data,
      });
    },
  });

  useEffect(() => {
    if (userQ.isSuccess) {
      addressForm.setFieldValue(
        "companyAddress",
        user?.organizations[0]?.company_address
      );
    }
  }, [userQ.status]);

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
        <div className="flex justify-between items-end">
          <h2 className="text-slate-700 text-base font-semibold leading-6 self-stretch mt-6 max-md:max-w-full">
            Company Address
          </h2>
          {addressForm.values.companyAddress != "" && (
            <p
              role="button"
              onClick={() => setDisabled(false)}
              className="text-sm font-semibold leading-4 text-blue-600"
            >
              Edit
            </p>
          )}
        </div>

        <div className="min-h-[44px]">
          {userQ.isLoading && (
            <Loader2 className="animate-spin text-blue-600" />
          )}
          {userQ.isSuccess && (
            <AutocompleteInput
              isDisabled={disabled}
              setAddress={(e: any) => {
                addressForm.setFieldValue("companyAddress", e);
              }}
              address={user?.organizations[0]?.company_address}
            />
          )}
        </div>

        <div className="flex justify-end">
          {isPending && <Loader2 className="animate-spin text-blue-600" />}
          <Button
            disabled={isPending}
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
