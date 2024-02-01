"use client";

import React, { ReactNode } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation } from "@tanstack/react-query";
import { createFacilityReportingPeriod } from "@/services/facility.api";
import { useFormik } from "formik";
import { Input } from "../ui/input";
import { useSearchParams } from "next/navigation";
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

const ReportingPeriod = () => {
  const searchParams = useSearchParams();
  const newReporting = searchParams.get("new");
  const editReporting = searchParams.get("edit");

  const { mutate, isPending } = useMutation({
    mutationFn: createFacilityReportingPeriod,
    onSuccess: (data) => {
      console.log(data);
    },
  });
  const { values, setFieldValue, errors, handleSubmit } = useFormik({
    initialValues: {
      reportingPeriodFrom: new Date(),
      reportingPeriodTo: new Date(),
    },
    onSubmit: (data) => {
      console.log(data);
      mutate({
        organizationFacilityId: "cb86f994-5c37-4361-b691-3fab40554f92",
        reportingPeriodFrom: "2024-01",
        reportingPeriodTo: "2024-03",
      });
    },
  });
  return (
    <div className="absolut3 t3p-8 l3ft-0 z-40">
      <section className="flex flex-col items-stretch px-6 py-7 bg-white rounded-sm  shadow-sm border border-gray-50 max-w-[456px]">
        <form className="flex gap-3 items-stretch pr-7 pl-2 text-xs font-light leading-4 text-slate-700">
          <label
            className="grow my-auto whitespace-nowrap"
            aria-label="Start Date Label"
          >
            Start Date
          </label>
          <DatePicker
            selected={values.reportingPeriodFrom}
            customInput={
              <Input className="w-[6.125rem] px-2 bg-gray-50 text-xs font-light text-slate-700" />
            }
            renderMonthContent={renderMonthContent}
            showMonthYearPicker
            dateFormat="yyyy/MM"
            onChange={(date) => setFieldValue("reportingPeriodFrom", date)}
          />
          <label className="my-auto">End Date</label>
          <DatePicker
            selected={values.reportingPeriodTo}
            customInput={
              <Input className="w-[6.125rem] px-2 bg-gray-50 text-xs font-light text-slate-700" />
            }
            renderMonthContent={renderMonthContent}
            showMonthYearPicker
            dateFormat="yyyy/MM"
            onChange={(date) => setFieldValue("reportingPeriodTo", date)}
          />
        </form>
        <button
          className="self-end mt-5 mr-4 text-sm font-semibold leading-5 text-blue-200"
          aria-label="Save Button"
          role="button"
        >
          Save
        </button>
      </section>
    </div>
  );
};

export default ReportingPeriod;
