import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addScopeEmissions,
  getReportingPeriodById,
} from "@/services/facility.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ScopeEmissions = ({ period }: { period: any }) => {
  console.log(period);
  const {
    data: periodDetails,
    isLoading,
    isSuccess,
    status,
  } = useQuery({
    queryKey: ["specific-period"],
    queryFn: () => getReportingPeriodById(period),
  });
  const isScopeEmissionsNull =
    isSuccess &&
    periodDetails?.data.scope1_total_emission == null &&
    periodDetails?.data.scope2_total_emission == null &&
    periodDetails?.data.scope3_total_emission == null;
  const [editMode, setEditMode] = useState(isScopeEmissionsNull ? true : false);
  const addScopeMut = useMutation({
    mutationFn: addScopeEmissions,
    onSuccess: (data) => {
      toast.success("Scope Emissions updated", { style: { color: "green" } });
      setEditMode(false);
    },
  });
  const { values, setValues, handleChange, handleSubmit } = useFormik({
    initialValues: {
      scope1TotalEmission: "",
      scope2TotalEmission: "",
      scope3TotalEmission: "",
    },
    onSubmit: (data) => {
      console.log(data);
      addScopeMut.mutate({ id: period, obj: data });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const emissionValues = {
        scope1TotalEmission: periodDetails.data?.scope1_total_emission,
        scope2TotalEmission: periodDetails.data?.scope2_total_emission,
        scope3TotalEmission: periodDetails.data?.scope3_total_emission,
      };
      setValues(emissionValues);
    }
  }, [status]);
  return (
    <div className="mt-5 max-md:max-w-full">
      {isLoading && <Loader2 className="text-blue-600 animate-spin" />}
      {isSuccess && (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-5 items-center justify-between max-md:flex-col ">
            <div className="flex flex-col items-stretch w-[48%] max-md:ml-0 max-md:w-full space-y-6">
              {/* Scope 1 */}
              <div
                className={cn(
                  "flex gap-3 items-stretch py-0.5 max-md:flex-wrap max-md:max-w-full",
                  !editMode && "justify-between"
                )}
              >
                <div className="flex gap-3 items-stretch px-3 py-1 my-auto bg-blue-100 bg-opacity-50 rounded-[999px]">
                  <div className="flex flex-col bg-blue-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                  <p className="text-xs font-semibold leading-4 text-center text-blue-800">
                    SCOPE 1
                  </p>
                </div>
                {editMode ? (
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="totalEmissions1"
                      className="grow justify-center self-stretch my-auto text-xs font-light leading-4 whitespace-nowrap text-slate-700"
                    >
                      Total Emissions
                    </label>
                    <Input
                      id="totalEmissions1"
                      placeholder="tCO2e"
                      onChange={handleChange}
                      value={values.scope1TotalEmission}
                      name="scope1TotalEmission"
                      className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-xs font-light leading-4 bg-gray-50 rounded-md text-slate-500"
                    />
                    <p className="text-xs text-gray-700 font-light">tCO2e</p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <p className="text-green-800 font-light pr-6">
                      {values.scope1TotalEmission
                        ? `${values.scope1TotalEmission} tCO2e`
                        : "Not Available"}
                    </p>
                  </div>
                )}
              </div>

              {/* Scope  2 */}
              <div
                className={cn(
                  "flex gap-3 items-stretch py-0.5 max-md:flex-wrap max-md:max-w-full",
                  !editMode && "justify-between"
                )}
              >
                <div className="flex gap-3 justify-center items-stretch px-3 py-1 my-auto bg-red-100 bg-opacity-50 rounded-[999px]">
                  <div className="flex flex-col bg-red-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                  <p className="text-xs font-semibold leading-4 text-center text-red-800">
                    SCOPE 2
                  </p>
                </div>

                {editMode ? (
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="totalEmissions2"
                      className="grow justify-center self-stretch my-auto text-xs font-light leading-4 whitespace-nowrap text-slate-700"
                    >
                      Total Emissions
                    </label>
                    <Input
                      id="totalEmissions2"
                      placeholder="tCO2e"
                      onChange={handleChange}
                      value={values.scope2TotalEmission}
                      name="scope2TotalEmission"
                      className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-xs font-light leading-4 bg-gray-50 rounded-md text-slate-500"
                    />
                    <p className="text-xs text-gray-700 font-light">tCO2e</p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <p className="text-green-800 font-light pr-6">
                      {values.scope2TotalEmission
                        ? `${values.scope2TotalEmission} tCO2e`
                        : "Not Available"}
                    </p>
                  </div>
                )}
              </div>

              {/* Scope 3 */}
              <div
                className={cn(
                  "flex gap-3 items-stretch py-0.5 max-md:flex-wrap max-md:max-w-full",
                  !editMode && "justify-between"
                )}
              >
                <div className="flex gap-3 justify-center items-stretch px-3 py-1 my-auto bg-green-100 bg-opacity-50 rounded-[999px]">
                  <div className="flex flex-col bg-green-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                  <p className="text-xs font-semibold leading-4 text-center text-green-800">
                    SCOPE 3
                  </p>
                </div>
                {editMode ? (
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="totalEmissions3"
                      className="grow justify-center self-stretch my-auto text-xs font-light leading-4 whitespace-nowrap text-slate-700"
                    >
                      Total Emissions
                    </label>
                    <Input
                      id="totalEmissions3"
                      placeholder="tCO2e"
                      name="scope3TotalEmission"
                      onChange={handleChange}
                      value={values.scope3TotalEmission}
                      className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-xs font-light leading-4 bg-gray-50 rounded-md text-slate-500"
                    />
                    <p className="text-xs text-gray-700 font-light">tCO2e</p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <p className="text-green-800 font-light pr-6">
                      {values.scope3TotalEmission
                        ? `${values.scope3TotalEmission} tCO2e`
                        : "Not Available"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-sky-50/50 grow rounded-md p-6 space-y-6">
              <div className="flex gap-3">
                <div className="flex gap-3 justify-center items-stretch px-3 py-2 my-auto bg-blue-100 bg-opacity-50 rounded-[999px]">
                  <div className="flex flex-col bg-blue-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                  <p className="text-xs font-semibold leading-4 text-center text-blue-800">
                    SCOPE 1
                  </p>
                </div>
                <div className="flex gap-3 justify-center items-stretch px-3 py-2 my-auto bg-red-100 bg-opacity-50 rounded-[999px]">
                  <div className="flex flex-col bg-red-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                  <p className="text-xs font-semibold leading-4 text-center text-red-800">
                    SCOPE 2
                  </p>
                </div>
                <div className="flex gap-3 justify-center items-stretch px-3 py-2 my-auto bg-green-100 bg-opacity-50 rounded-[999px]">
                  <div className="flex flex-col bg-green-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                  <p className="text-xs font-semibold leading-4 text-center text-green-800">
                    SCOPE 3
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-slate-800 ">
                Scope 1 Emissions
              </p>
              <p className="leading-6 w-[25rem]">
                Scope 1 emissions are direct greenhouse gas (GHG) emissions that
                a company generates while performing its business activities.
                These emissions come from sources that are owned or controlled
                by an organization.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            {!editMode && (
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                onClick={() => setEditMode(true)}
                className="ml-auto items-stretch self-end px-4 py-2 mt-4 text-blue-600 hover:text-blue-600 text-sm font-semibold leading-4 text-center"
              >
                Edit
              </Button>
            )}
            {editMode && (
              <Button
                size={"sm"}
                type="submit"
                className="ml-auto items-stretch self-end px-4 py-2 mt-4 text-sm font-semibold leading-4 text-center"
              >
                Save
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ScopeEmissions;
