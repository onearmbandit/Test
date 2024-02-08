"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccountStore } from "@/lib/stores/organisation.store";
import { cn } from "@/lib/utils";
import { setupOrganizationStep4 } from "@/services/organizations.api";
import { getUser } from "@/services/user.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const EditClimateConditions = ({
  setSection,
}: {
  setSection: (val: string) => void;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [targets, setTargets] = useState<string[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string>("");
  const queryClient = useQueryClient();
  const { setNav } = useAccountStore();

  const userQ = useQuery({
    queryKey: ["climate-details"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data : null;

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: setupOrganizationStep4,
    onSuccess: (organization) => {
      toast.success("Your organization profile has been updated", {
        style: { color: "green" },
      });
      queryClient.invalidateQueries({
        queryKey: ["account-details", "climate-commitments"],
      });
      setSection("home");
    },
    onError: (err: any) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const climateForm = useFormik({
    initialValues: {
      climateTargets: [],
      profileStep: 4,
    },
    onSubmit: (data: any) => {
      const organizationId = session?.user?.organizations[0]?.id!;
      if (organizationId) {
        mutate({
          id: organizationId,
          formdata: { ...data, climateTargets: targets },
        });
      }
    },
  });

  const removeTarget = (index: any) => {
    setTargets((prevTargets) => prevTargets.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (userQ.isSuccess) {
      const targetArray = user?.data?.organizations[0].climate_targets;
      climateForm.setFieldValue("climateTargets", targetArray);
      setTargets(targetArray);
    }
  }, [userQ.status]);

  return (
    <form
      onSubmit={climateForm.handleSubmit}
      className="items-start self-stretch bg-white flex grow rounded-e-lg flex-col max-w-full space-y-6  pt-6 px-8 max-md:px-5"
    >
      <header className="text-blue-600 text-xs font-medium leading-5 self-stretch max-md:max-w-full">
        <span className="text-slate-500">
          {" "}
          <span
            role="submit"
            onClick={() => {
              setNav("myAccount");
              setSection("home");
            }}
          >
            Account
          </span>{" "}
          &gt; Organization Account &gt;{" "}
        </span>
        <span className="text-blue-600">Edit Climate Commitments</span>
      </header>
      <h1 className="text-gray-700 text-lg font-bold leading-7 self-stretch mt-9 border-b border-gray-300  pb-3 max-md:max-w-full">
        Edit Climate Commitments
      </h1>

      <h2 className="self-stretch text-slate-700 text-base font-semibold leading-6 mt-6 max-md:max-w-full">
        Climate commitments
      </h2>
      <div className="rounded bg-gray-50 self-stretch flex flex-wrap gap-4 h-[5.875rem] max-h-[128px] overflow-auto p-[0.62rem] items-start max-md:max-w-full">
        {targets.map((target, index) => (
          <div
            key={index}
            className="justify-between items-stretch border border-green-100 bg-green-50 flex gap-0.5 px-2.5 py-2 rounded-md border-solid"
          >
            <div className="text-green-800 text-xs font-medium leading-4 grow whitespace-nowrap">
              {target}
            </div>

            <button onClick={() => removeTarget(index)}>
              <X size={12} className="text-green-800" />
            </button>
          </div>
        ))}
      </div>
      <div className="w-full">
        <Input
          id="employees"
          name="targets"
          value={currentTarget}
          onChange={(e) => {
            setCurrentTarget(e.target.value);
          }}
          className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
          placeholder="ex: Carbon neutral by 2030"
        />
        <p
          className={cn(
            "text-slate-500 text-xs font-light",
            currentTarget.length > 50 && "text-red-500"
          )}
        >
          {currentTarget.length}/50 Characters
        </p>
      </div>

      <div className="flex w-[153px] max-w-full flex-col items-end mt-8 mb-7 self-end">
        <Button
          variant={"ghost"}
          type="button"
          onClick={() => {
            const targetCopy = currentTarget;
            if (currentTarget) {
              setTargets([...targets, targetCopy]);
            }
            setCurrentTarget("");
          }}
          disabled={currentTarget.length > 50}
          className="text-blue-600 text-center text-sm font-bold leading-4 whitespace-nowrap"
        >
          + Add another target
        </Button>
        <Button
          disabled={currentTarget.length > 50 || isPending}
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
