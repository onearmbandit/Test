"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  setupOrganizationStep1,
  setupOrganizationStep2,
  setupOrganizationStep3,
  setupOrganizationStep4,
} from "@/services/organizations.api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const Page = () => {
  const session = useSession();

  const [step, setStep] = useState(1);

  const [currentStep, setCurrentStep] = useState(1);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const steps: {
    [key: number]: ({ setStep }: any) => JSX.Element;
  } = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
  };

  const CreateOrganisation = steps[step];

  return (
    <div className="items-center bg-white h-screen flex flex-col pb-12">
      <header className="bg-gray-100 bg-opacity-30 self-stretch flex w-full flex-col pb-12 items-start max-md:max-w-full">
        <section className="max-w-[50.875rem] w-full mx-auto mt-14 mb-3.5 max-md:max-w-full max-md:mt-10">
          <h1 className="text-neutral-900 text-5xl font-semibold leading-[52.8px] max-md:max-w-full max-md:text-4xl">
            Set up your organization profile
          </h1>
          <h2 className=" text-slate-500 text-2xl font-medium leading-8 mt-4 max-md:max-w-full">
            Let&apos;s start with your background information
          </h2>
        </section>
      </header>
      <CreateOrganisation setStep={setStep} />
    </div>
  );
};

const Step1 = ({ setStep, setCurrentStep }: any) => {
  const router = useRouter();
  const session = useSession();

  const validation = z.object({
    companyEmail: z.string().email(),
    profileStep: z.number().int().min(1).max(3),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: setupOrganizationStep1,
    onSuccess: (organization) => {
      // setUserId(organization.data.id);
      toast.success("Your organization profile has been updated", {
        style: { color: "green" },
      });
      setStep(2);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const setupOrganizationStep1Form = useFormik({
    initialValues: {
      companyEmail: "",
      profileStep: 1,
    },
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data: any) => {
      const organizationId: string | undefined =
        session.data?.user?.organizations[0]?.id;
      if (organizationId) {
        mutate({ id: organizationId, formdata: data });
      }
    },
  });

  return (
    <form onSubmit={setupOrganizationStep1Form.handleSubmit}>
      <div className="max-w-[50.875rem]">
        <h3 className="text-slate-700 text-2xl font-medium leading-8 self-center mt-6 max-md:max-w-full">
          Do you want to invite another user to your organization?
        </h3>
        <p className="self-center text-slate-500 text-base font-light leading-6 w-[814px] max-w-full mt-6">
          We&apos;ll be asking you a few questions on your scope 1, 2, and 3
          carbon emissions. If you have a better point of contact to fill out
          this information, please add their email here and we&apos;ll invite
          them to join the platform.
        </p>
        <div>
          <Input
            type="text"
            placeholder="Add their email"
            name="companyEmail"
            id="companyEmail"
            onChange={setupOrganizationStep1Form.handleChange}
            className={cn(
              "text-slate-500 text-xs font-light leading-4 items-stretch self-center bg-gray-50 w-[814px] max-w-full justify-center mt-6 px-2 py-7 rounded-md max-md:max-w-full",
              setupOrganizationStep1Form.touched.companyEmail &&
                setupOrganizationStep1Form.errors.companyEmail &&
                "border border-red-500"
            )}
          />

          <p className="text-red-500 text-xs mt-[10px]">
            {setupOrganizationStep1Form.errors.companyEmail as React.ReactNode}
          </p>
        </div>

        <div className="justify-between items-center self-center flex w-[814px] max-w-full gap-5 mt-6 mb-44 p-2.5 max-md:flex-wrap max-md:mb-10">
          <div
            role="button"
            onClick={() => router.push("/")}
            className="text-blue-600 text-center text-sm font-bold leading-4 my-auto"
          >
            Back
          </div>
          <div className="justify-between items-center self-stretch flex gap-3.5 pl-20 py-2 max-md:max-w-full max-md:flex-wrap max-md:pl-5">
            <div
              onClick={() => setStep(2)}
              role="button"
              className="text-blue-600 text-center text-sm font-bold leading-4 grow whitespace-nowrap my-auto"
            >
              Skip
            </div>

            <div className="justify-end flex pr-2.5 py-2.5 items-center max-md:max-w-full max-md:pl-5">
              {isPending && (
                <Loader2 size={30} className="text-slate-400 animate-spin" />
              )}
              <Button
                disabled={isPending}
                className="text-white text-center text-sm font-bold leading-4 whitespace-nowrap"
                type="submit"
              >
                Save and continue
              </Button>
            </div>

            {/* <Button
              type="submit"
              // onClick={() => setStep(2)}
              className="text-white text-center text-sm font-bold leading-4 whitespace-nowrap"
            >
              Save and continue
            </Button> */}
          </div>
        </div>
      </div>
    </form>
  );
};

const Step2 = ({ setStep }: any) => {
  const session = useSession();
  const [selected, setSelected] = useState<number | null>(null);
  const sizes = [
    "1 to 10",
    "10 to 25",
    "26 to 50",
    "51 to 100",
    "101 to 200",
    "201 to 500",
    "501 to 1000",
    "1001 to 10,000",
    "10,000+",
  ];

  const validation = z.object({
    companySize: z.string(),
    profileStep: z.number().int().min(1).max(3),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: setupOrganizationStep2,
    onSuccess: (organization) => {
      toast.success("Your organization profile has been updated", {
        style: { color: "green" },
      });
      setStep(3);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const setupOrganizationStep2Form = useFormik({
    initialValues: {
      companySize: "",
      profileStep: 2,
    },
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data: any) => {
      const organizationId: string | undefined =
        session.data?.user?.organizations[0]?.id;
      if (organizationId) {
        mutate({ id: organizationId, formdata: data });
      }
    },
  });

  return (
    <form onSubmit={setupOrganizationStep2Form.handleSubmit}>
      <div className="max-w-[50.875rem] w-full">
        <header className="header text-slate-700 text-2xl font-medium leading-8 w-full max-md:max-w-full">
          What is the size of your company?*
        </header>
        <div className="company-size-container grid grid-cols-3 w-5/6 gap-4 mt-6 max-md:max-w-full max-md:flex-wrap">
          {sizes.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSelected(i);
                setupOrganizationStep2Form.setFieldValue("companySize", item);
              }}
              className={`company-size-option  text-lg font-bold leading-7 whitespace-nowrap justify-center items-center grow px-7 py-4 rounded-2xl border-solid max-md:px-5 ${
                selected == i
                  ? "bg-blue-200 border-2 border-blue-500 text-blue-700"
                  : "border border-slate-500 text-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="actions-container justify-between items-center flex w-full gap-5 mt-6 px-2.5 py-5 max-md:max-w-full max-md:flex-wrap">
          <p
            onClick={() => setStep(1)}
            className="back-button text-blue-600 text-center text-sm font-bold leading-4 my-auto"
          >
            Back
          </p>

          <div className="justify-between items-center self-stretch flex gap-3.5 pl-20 py-2 max-md:max-w-full max-md:flex-wrap max-md:pl-5">
            <div
              onClick={() => setStep(3)}
              role="button"
              className="text-blue-600 text-center text-sm font-bold leading-4 grow whitespace-nowrap my-auto"
            >
              Skip
            </div>

            <div className="justify-end flex pr-2.5 py-2.5 items-center max-md:max-w-full max-md:pl-5">
              {isPending && (
                <Loader2 size={30} className="text-slate-400 animate-spin" />
              )}
              <Button
                disabled={selected == null}
                className="save-button text-white text-center text-sm font-bold leading-4 whitespace-nowrap"
                type="submit"
              >
                Save and continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const Step3 = ({ setStep }: any) => {
  const session = useSession();
  const validation = z.object({
    naicsCode: z
      .string()
      .regex(/^[0-9]{4,5}$/, "Please enter a valid NAICS code"),
    profileStep: z.number().int().min(1).max(3),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: setupOrganizationStep3,
    onSuccess: (organization) => {
      toast.success("Your organization profile has been updated", {
        style: { color: "green" },
      });
      setStep(4);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const setupOrganizationStep3Form = useFormik({
    initialValues: {
      naicsCode: "",
      profileStep: 3,
    },
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data: any) => {
      const organizationId: string | undefined =
        session.data?.user?.organizations[0]?.id;
      if (organizationId) {
        mutate({ id: organizationId, formdata: data });
      }
    },
  });

  return (
    <form onSubmit={setupOrganizationStep3Form.handleSubmit}>
      <div className="max-w-[50.875rem]">
        <header className="text-slate-700 text-2xl font-medium leading-8 self-stretch w-full max-md:max-w-full">
          What is your NAICS code?
        </header>
        <div className="self-stretch text-[#64748B] text-base font-light leading-6 w-full mt-6 max-md:max-w-full">
          The North American Industry Classification System (NAICS) helps us
          compare your business to industry benchmarks. If you&apos;re not sure
          what your NAICS number is, you can find your category here:{" "}
          <a
            href="https://www.census.gov/naics/"
            target="_blank"
            className="text-blue-600"
          >
            https://www.census.gov/naics/.
          </a>
        </div>
        <Input
          name="naicsCode"
          id="naicsCode"
          placeholder="Add NAICS code"
          onChange={setupOrganizationStep3Form.handleChange}
          className={cn(
            "text-slate-500 text-xs font-light leading-4 items-stretch self-center bg-gray-50 w-[814px] max-w-full justify-center mt-6 px-2 py-7 rounded-md max-md:max-w-full",
            setupOrganizationStep3Form.touched.naicsCode &&
              setupOrganizationStep3Form.errors.naicsCode &&
              "border border-red-500"
          )}
        />

        <p className="text-red-500 text-xs mt-[10px]">
          {setupOrganizationStep3Form.errors.naicsCode as React.ReactNode}
        </p>

        <div className="justify-between items-center self-stretch flex w-full gap-5 mt-6 p-2.5 max-md:max-w-full max-md:flex-wrap">
          <div
            onClick={() => setStep(4)}
            role="button"
            className="text-blue-600 text-center text-sm font-bold leading-4 my-auto"
          >
            Back
          </div>

          <div className="justify-between items-center self-stretch flex gap-3.5 pl-20 py-2 max-md:max-w-full max-md:flex-wrap max-md:pl-5">
            <div
              onClick={() => setStep(4)}
              role="button"
              className="text-blue-600 text-center text-sm font-bold leading-4 grow whitespace-nowrap my-auto"
            >
              Skip
            </div>

            <div className="justify-end flex pr-2.5 py-2.5 items-center max-md:max-w-full max-md:pl-5">
              {isPending && (
                <Loader2 size={30} className="text-slate-400 animate-spin" />
              )}
              <Button
                disabled={isPending}
                className="save-button text-white text-center text-sm font-bold leading-4 whitespace-nowrap"
                type="submit"
              >
                Save and continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

/**
 * TODO: the character limit here will be 20-30
 */
const Step4 = ({ setStep }: any) => {
  const router = useRouter();
  const session = useSession();
  const [targets, setTargets] = useState<string[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string>("");
  const validation = z.object({
    climateTargets: z
      .array(z.string())
      .min(1, "Atleast one climate target is required"),
    profileStep: z.number().int().min(1).max(3),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: setupOrganizationStep4,
    onSuccess: (organization) => {
      toast.success("Your organization profile has been updated", {
        style: { color: "green" },
      });
      setStep(4);
    },
    onError: (err: any) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const setupOrganizationStep4Form = useFormik({
    initialValues: {
      climateTargets: [],
      profileStep: 3,
    },
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data: any) => {
      // const organizationId: string | undefined =
      //   session.data?.user?.organizations[0]?.id;
      // if (organizationId) {
      //   mutate({ id: organizationId, formdata: data });
      // }

      router.push("/");
    },
  });

  return (
    <div className="justify-center items-start flex max-w-[814px] w-full flex-col">
      <div role="group" className="mt-6">
        <label className="text-slate-700 text-base font-medium leading-6">
          Do you have goals or targets to reduce greenhouse gas emissions and/or
          energy?
        </label>
        <p className="text-slate-500 text-sm font-light leading-5 mt-1">
          For example, Science Based Target initiatives or commitments that are
          climate related (ex: Carbon neutral by 2040, Net Zero by 2030).
        </p>
        <Input
          type="text"
          name="targets"
          value={currentTarget}
          onChange={(e) => {
            setCurrentTarget(e.target.value);
          }}
          className="text-slate-500 text-xs font-light leading-4 bg-gray-50 self-stretch mt-2 px-2 py-6 rounded-md"
          placeholder="ex: Carbon neutral by 2030"
        />
        <div
          onClick={() => {
            const targetCopy = currentTarget;
            if (currentTarget) {
              setTargets([...targets, targetCopy]);
            }
            setCurrentTarget("");
            console.log(targets);
          }}
          className="text-blue-200 text-center text-sm font-bold leading-4 whitespace-nowrap mt-4"
        >
          + Add another target
        </div>
      </div>
      <div className="justify-between items-center self-stretch flex w-full gap-5 mt-6 p-2.5 max-md:max-w-full max-md:flex-wrap">
        <div
          onClick={() => setStep(3)}
          role="button"
          className="text-blue-600 text-center text-sm font-bold leading-4 my-auto"
        >
          Back
        </div>

        <div className="justify-between items-center self-stretch flex gap-3.5 pl-20 py-2 max-md:max-w-full max-md:flex-wrap max-md:pl-5">
          <div
            onClick={() => setStep(4)}
            role="button"
            className="text-blue-600 text-center text-sm font-bold leading-4 grow whitespace-nowrap my-auto"
          >
            Skip
          </div>

          <div className="justify-end flex pr-2.5 py-2.5 items-center max-md:max-w-full max-md:pl-5">
            {isPending && (
              <Loader2 size={30} className="text-slate-400 animate-spin" />
            )}
            <Button
              disabled={isPending}
              className="save-button text-white text-center text-sm font-bold leading-4 whitespace-nowrap"
              type="submit"
            >
              Save and continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
