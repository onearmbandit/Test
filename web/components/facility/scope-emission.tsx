"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addScopeEmissions,
  getReportingPeriodById,
} from "@/services/facility.api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSearchParams } from "next/navigation";

const ScopeEmissions = ({
  period,
  completeStatus,
  setStatus,
}: {
  period: any;
  completeStatus: { 1: boolean; 2: boolean; 3: boolean };
  setStatus: React.Dispatch<
    SetStateAction<{ 1: boolean; 2: boolean; 3: boolean }>
  >;
}) => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");
  const queryClient = useQueryClient();

  const {
    data: periodDetails,
    isLoading,
    isSuccess,
    status,
  } = useQuery({
    queryKey: ["specific-period", period],
    queryFn: () => getReportingPeriodById(period),
  });

  const isScopeEmissionsNull =
    isSuccess &&
    periodDetails?.data?.scope1_total_emission == null &&
    periodDetails?.data?.scope2_total_emission == null &&
    periodDetails?.data?.scope3_total_emission == null;
  const [editMode, setEditMode] = useState(isScopeEmissionsNull ? true : false);

  const addScopeMut = useMutation({
    mutationFn: addScopeEmissions,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      queryClient.invalidateQueries({
        queryKey: ["facility-details", facilityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["facilitydetails", facilityId],
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      toast.success("Scope Emissions updated", { style: { color: "green" } });
      setEditMode(false);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const { values, setValues, handleChange, handleSubmit } = useFormik({
    initialValues: {
      scope1TotalEmission: "",
      scope2TotalEmission: "",
      scope3TotalEmission: "",
    },
    onSubmit: (data) => {
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
      if (
        periodDetails.data?.scope1_total_emission != null ||
        periodDetails.data?.scope2_total_emission != null ||
        periodDetails.data?.scope3_total_emission != null
      ) {
        setStatus({ ...completeStatus, 1: true });
      }
      setValues(emissionValues);
    }
  }, [status, periodDetails]);
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
                      type="number"
                      onChange={handleChange}
                      value={values.scope1TotalEmission}
                      name="scope1TotalEmission"
                      className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-sm font-light leading-4 bg-gray-50 rounded-md text-slate-500"
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
                      type="number"
                      value={values.scope2TotalEmission}
                      name="scope2TotalEmission"
                      className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-sm font-light leading-4 bg-gray-50 rounded-md text-slate-500"
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
                      type="number"
                      value={values.scope3TotalEmission}
                      className="grow justify-center items-stretch self-stretch p-2 max-w-24 text-sm font-light leading-4 bg-gray-50 rounded-md text-slate-500"
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

            <div className="bg-sky-50/50 grow rounded-md p-6 space-y-6 h-[340px]">
              <Tabs defaultValue="scope-1">
                <TabsList className="flex gap-3">
                  <TabsTrigger
                    value="scope-1"
                    className="flex gap-3 data-[state=active]:border-2 justify-center items-stretch px-3 data-[state=active]:px-5 py-2 my-auto bg-blue-100 bg-opacity-50 rounded-[999px]"
                  >
                    <div className="flex flex-col bg-blue-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                    <p className="text-xs font-semibold leading-4 text-center text-blue-800">
                      SCOPE 1
                    </p>
                  </TabsTrigger>
                  <TabsTrigger
                    value="scope-2"
                    className="flex gap-3 data-[state=active]:border-2 data-[state=active]:border-red-500 data-[state=active]:px-5 justify-center items-stretch px-3 py-2 my-auto bg-red-100 bg-opacity-50 rounded-[999px]"
                  >
                    <div className="flex flex-col bg-red-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                    <p className="text-xs font-semibold leading-4 text-center text-red-800">
                      SCOPE 2
                    </p>
                  </TabsTrigger>
                  <TabsTrigger
                    value="scope-3"
                    className="flex gap-3 data-[state=active]:border-2 data-[state=active]:border-green-700 data-[state=active]:px-5 justify-center items-stretch px-3 py-2 my-auto bg-green-100 bg-opacity-50 rounded-[999px]"
                  >
                    <div className="flex flex-col bg-green-800 shrink-0 my-auto w-3 h-3 rounded-full" />
                    <p className="text-xs font-semibold leading-4 text-center text-green-800">
                      SCOPE 3
                    </p>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="scope-1" className="py-6 space-y-6">
                  <p className="text-lg font-bold text-slate-800 ">
                    Scope 1 Emissions
                  </p>
                  <p className="text-base leading-6 w-[25rem] font-[300]">
                    Scope 1 emissions are direct greenhouse gas (GHG) emissions
                    that a company generates while performing its business
                    activities. These emissions come from sources that are owned
                    or controlled by an organization.
                  </p>
                </TabsContent>
                <TabsContent value="scope-2" className="py-6 space-y-6">
                  <p className="text-lg font-bold text-slate-800 ">
                    Scope 2 Emissions
                  </p>
                  <p className="text-base leading-6 w-[25rem] font-[300]">
                    Scope 2 emissions are indirect emissions from the
                    consumption of purchased electricity, steam, heating, and
                    cooling. They result from energy produced elsewhere but used
                    by a company, highlighting the carbon footprint of the
                    company&apos;s purchased energy.
                  </p>
                </TabsContent>
                <TabsContent value="scope-3" className="py-6 space-y-6">
                  <p className="text-lg font-bold text-slate-800 ">
                    Scope 3 Emissions
                  </p>
                  <p className="text-base leading-6 w-[25rem] font-[300]">
                    Scope 3 emissions are all indirect emissions that occur in a
                    company&apos;s value chain, including both upstream and
                    downstream emissions. These can include the production of
                    purchased goods, transportation of purchased fuels, and use
                    of sold products and services.
                  </p>
                </TabsContent>
              </Tabs>
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
