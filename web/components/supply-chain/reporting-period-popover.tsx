"use client";
import React, { ReactNode, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useFormik } from "formik";
import dayjs from "dayjs";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addReportingPeriod,
  deleteReportingPerid,
  editReportingPerid,
} from "@/services/supply.chain";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { useSession } from "next-auth/react";
import { getUser } from "@/services/user.api";
const ReportingPeriodPopup = ({
  setNew,
  period,
}: {
  setNew: React.Dispatch<React.SetStateAction<boolean>>;
  period?: any;
}) => {
  const queryClient = useQueryClient();
  const [isDateEdit, setIsDateEdit] = useState(false);

  const userQ = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data.data : {};

  const organizationId = user.organizations[0].id!;

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

  const validation = z.object({
    reportingPeriodFrom: z.date(),
    reportingPeriodTo: z.date(),
  });
  const editMuation = useMutation({
    mutationFn: editReportingPerid,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      toast.success("Reporting period updated", { style: { color: "green" } });
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: 'red' } });
    },
  });
  const addReportMut = useMutation({
    mutationFn: addReportingPeriod,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      queryClient.invalidateQueries({ queryKey: ["reporting-periods"] });
      setNew(false);

      console.log(data, "data addd");
      toast.success("Reporting period Added.", { style: { color: "green" } });
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: "red" } });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteReportingPerid,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      queryClient.invalidateQueries({ queryKey: ["reporting-periods"] });

      toast.success("Reporting period Deleted.", {
        style: { color: "green" },
      });
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: 'red' } });
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
          editMuation.mutate({
            id: period.id,
            formData: {
              organizationId: organizationId,
              reportingPeriodFrom: dayjs(data.reportingPeriodFrom).format(
                "YYYY-MM"
              ),
              reportingPeriodTo: dayjs(data.reportingPeriodTo).format(
                "YYYY-MM"
              ),
            },
          });
        } else
          addReportMut.mutate({
            organizationId: organizationId,
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
    // <div className='relative'>
    <div className="absolut left- z-1000 top">
      <section className="flex flex-col items-stretch px-6 py-7 bg-white rounded-sm  shadow-md border border-gray-50 max-w-[456px]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex gap-3 items-stretch pr-2 pl-2 text-xs font-light leading-4 text-slate-700">
            <label
              className="grow my-auto whitespace-nowrap"
              aria-label="Start Date Label"
            >
              Start Date
            </label>
            <DatePicker
              selected={values.reportingPeriodFrom}
              customInput={
                <Input className="w-[6.125rem] px-2 bg-gray-50 text-sm font-light text-slate-700" />
              }
              renderMonthContent={renderMonthContent}
              showMonthYearPicker
              disabled={period && !isDateEdit}
              dateFormat="yyyy/MM"
              onChange={(date: any) =>
                setFieldValue("reportingPeriodFrom", date)
              }
            />
            <label className="my-auto whitespace-nowrap">End Date</label>
            <DatePicker
              selected={values.reportingPeriodTo}
              customInput={
                <Input className="w-[6.125rem] px-2 bg-gray-50 text-sm font-light text-slate-700" />
              }
              renderMonthContent={renderMonthContent}
              disabled={period && !isDateEdit}
              showMonthYearPicker
              dateFormat="yyyy/MM"
              onChange={(date: any) => setFieldValue("reportingPeriodTo", date)}
            />
          </div>
          {period != undefined && !isDateEdit ? (
            <div className="flex justify-between items-center mt-5">
              <Dialog>
                <DialogTrigger>
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="text-red-500 text-sm font-semibold leading-5 border-0"
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
                      onClick={() => deleteMutation.mutate(period.id)}
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
                      onClick={() => setIsDateEdit(true)}
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
              variant={"ghost"}
              className="self-end mt-5 text-sm font-semibold leading-5 text-blue-600 focus:border-0"
              aria-label="Save Button"
              role="button"
              type="submit"
            >
              Save
            </Button>
          )}
        </form>
      </section>
    </div>
    // </div>
  );
};

export default ReportingPeriodPopup;
