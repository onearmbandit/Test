"use client";

import React, { ReactNode, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addFacilityReportingPeriod,
  deleteFacilityReportingPeriod,
  editFacilityReportingPeriod,
} from "@/services/facility.api";
import { useFormik } from "formik";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import dayjs from "dayjs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";

const renderMonthContent = (
  monthIndex: number,
  shortMonthIndex: string,
  longMonthText: string
): ReactNode => {
  const fullYear = new Date(monthIndex).getFullYear();
  const tooltipText = `Tooltip for month: ${longMonthText} ${fullYear}`;

  return (
    <p title={tooltipText} className="p-1.5">
      {shortMonthIndex}
    </p>
  );
};

const ReportingPeriod = ({
  setNew,
  period,
}: {
  setNew: React.Dispatch<React.SetStateAction<boolean>>;
  period?: any;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const facilityId = searchParams.get("facilityId");
  const queryClient = useQueryClient();
  const [isEdit, setEdit] = useState(false);

  const validation = z.object({
    reportingPeriodFrom: z.date(),
    reportingPeriodTo: z.date(),
  });

  console.log("period", period);
  const editMut = useMutation({
    mutationFn: editFacilityReportingPeriod,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      queryClient.invalidateQueries({
        queryKey: ["reporting-periods"],
      });
      toast.success("Reporting period updated", { style: { color: "green" } });
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteFacilityReportingPeriod,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      queryClient.invalidateQueries({
        queryKey: ["reporting-periods"],
      });
      toast.success("Reporting period Deleted.", { style: { color: "green" } });
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addFacilityReportingPeriod,
    onSuccess: (data) => {
      if (data.errors) {
        console.log("errror", data);
        throw new Error(data.errors[0].message);
      }
      queryClient.invalidateQueries({});
      setNew(false);
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const { values, setFieldValue, errors, handleSubmit, submitForm } = useFormik(
    {
      initialValues: {
        reportingPeriodFrom: null,
        reportingPeriodTo: null,
      },
      validationSchema: toFormikValidationSchema(validation),
      validateOnChange: false,
      validateOnBlur: true,
      onSubmit: (data) => {
        if (period) {
          editMut.mutate({
            id: period.id,
            formData: {
              reportingPeriodFrom: dayjs(data.reportingPeriodFrom).format(
                "YYYY-MM"
              ),
              reportingPeriodTo: dayjs(data.reportingPeriodTo).format(
                "YYYY-MM"
              ),
            },
          });
        } else
          mutate({
            organizationFacilityId: facilityId,
            reportingPeriodFrom: dayjs(data.reportingPeriodFrom).format(
              "YYYY-MM"
            ),
            reportingPeriodTo: dayjs(data.reportingPeriodTo).format("YYYY-MM"),
          });
      },
    }
  );

  useEffect(() => {
    if (period) {
      setFieldValue(
        "reportingPeriodFrom",
        dayjs(period.reporting_period_from).toDate()
      );
      setFieldValue(
        "reportingPeriodTo",
        dayjs(period.reporting_period_to).toDate()
      );
    }
  }, []);

  return (
    <div className="absolut3 t3p-8 l3ft-0 z-40">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-stretch px-6 py-7 bg-white rounded-sm  shadow-sm border border-gray-50 max-w-[456px]"
      >
        <div className="flex gap-3 items-stretch pr-7 pl-2 text-xs font-light leading-4 text-slate-700">
          <label
            className="grow my-auto whitespace-nowrap"
            aria-label="Start Date Label"
          >
            Start Date
          </label>
          <DatePicker
            selected={values.reportingPeriodFrom}
            customInput={
              <Input
                placeholder="MM/YYYY"
                className="w-[6.125rem] px-2 bg-gray-50 text-sm font-light text-slate-700"
              />
            }
            disabled={period && !isEdit}
            renderMonthContent={renderMonthContent}
            showMonthYearPicker
            dateFormat="yyyy/MM"
            placeholderText="MM/YYYY"
            onChange={(date) => setFieldValue("reportingPeriodFrom", date)}
          />
          <label className="my-auto">End Date</label>
          <DatePicker
            selected={values.reportingPeriodTo}
            customInput={
              <Input className="w-[6.125rem] px-2 bg-gray-50 text-sm font-light text-slate-700" />
            }
            disabled={period && !isEdit}
            renderMonthContent={renderMonthContent}
            showMonthYearPicker
            dateFormat="yyyy/MM"
            placeholderText="MM/YYYY"
            onChange={(date) => setFieldValue("reportingPeriodTo", date)}
          />
        </div>
        {period != undefined && !isEdit ? (
          <div className="flex justify-between items-center mt-5">
            <Dialog>
              <DialogTrigger>
                <Button
                  type="button"
                  variant={"ghost"}
                  className="text-red-500 text-sm font-semibold leading-5 hover:text-red-500"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6 space-y-5">
                <p className="text text-center">
                  Are you sure you want to delete the reporting period?
                </p>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="border-2 border-red-500 w-full font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    No, don&apos;t delete the reporting period
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => deleteMut.mutate(period.id)}
                    className="border-2 border-gray-400 w-full font-semibold text-gray-400 hover:text-gray-600"
                  >
                    Yes, continue
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger>
                <Button
                  type="button"
                  variant={"ghost"}
                  className="text-blue-600 text-sm font-semibold leading-5 hover:text-blue-600"
                >
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6 space-y-5">
                <p className="text text-center">
                  Are you sure you want to update the reporting period?
                </p>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant={"outline"}
                    className="border-2 border-blue-600 w-full font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    No, don&apos;t update the reporting period
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setEdit(true)}
                    className="border-2 border-gray-400 w-full font-semibold text-gray-400 hover:text-gray-600"
                  >
                    Yes, continue
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Button
            type="submit"
            disabled={isPending || editMut.isPending || deleteMut.isPending}
            variant={"ghost"}
            className="self-end mt-5 mr-4 text-sm text-blue-600 hover:text-blue-600 font-semibold leading-5 disabled:text-blue-200"
          >
            Save
          </Button>
        )}
      </form>
    </div>
  );
};

export default ReportingPeriod;
