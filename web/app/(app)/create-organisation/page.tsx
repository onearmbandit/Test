"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getOrganizationDetails,
  setupOrganizationStep1,
  setupOrganizationStep2,
  setupOrganizationStep3,
  setupOrganizationStep4,
} from "@/services/organizations.api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { getUser } from "@/services/user.api";

const Page = () => {
  const session = useSession();

  const [step, setStep] = useState(1);
  const userQ = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data.data : null;

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
      {userQ.isLoading && <Loader2 className="text-blue-400 animate-spin" />}
      {userQ.isSuccess && <CreateOrganisation setStep={setStep} user={user} />}
    </div>
  );
};

const Step1 = ({ setStep, setCurrentStep, user }: any) => {
  const router = useRouter();
  // const session = useSession();

  const orgDetail = useQuery({
    queryKey: ["org-email"],
    queryFn: () => getOrganizationDetails(user?.organizations[0]?.id!),
  });
  const organization = orgDetail.isSuccess ? orgDetail.data.data : {};

  const validation = z.object({
    companyEmail: z.string().email({ message: "Please enter a valid email" }),
    profileStep: z.number().int().min(1).max(3),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: setupOrganizationStep1,
    onSuccess: (organization: any) => {
      // setUserId(organization.data.id);
      if (organization.errors) {
        throw new Error(organization.errors[0].message);
      }
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
      const organizationId: string | undefined = user?.organizations[0]?.id;
      if (organizationId) {
        mutate({ id: organizationId, formdata: data });
      }
    },
  });

  useEffect(() => {
    if (orgDetail.isSuccess) {
      setupOrganizationStep1Form.setFieldValue(
        "companyEmail",
        organization?.company_email ? organization?.company_email : ""
      );
    }
  }, [orgDetail.isSuccess, orgDetail.data]);

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
            value={setupOrganizationStep1Form.values.companyEmail}
            onChange={setupOrganizationStep1Form.handleChange}
            className={cn(
              "text-slate-500 text-sm font-light leading-4 items-stretch self-center bg-gray-50 max-w-full justify-center mt-6 px-2 py-7 rounded-md lg:max-w-[367px] w-full",

              setupOrganizationStep1Form.touched.companyEmail &&
                setupOrganizationStep1Form.errors.companyEmail &&
                "border border-red-500"
            )}
          />

          <p className="text-red-500 text-xs mt-[10px]">
            {setupOrganizationStep1Form.touched.companyEmail &&
              (setupOrganizationStep1Form.errors
                .companyEmail as React.ReactNode)}
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

const Step2 = ({ setStep, user }: any) => {
  // const session = useSession();
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

  const orgDetail = useQuery({
    queryKey: ["org-capacity"],
    queryFn: () => getOrganizationDetails(user?.organizations[0]?.id!),
  });
  const organization = orgDetail.isSuccess ? orgDetail.data.data : {};

  const validation = z.object({
    companySize: z.string(),
    profileStep: z.number().int().min(1).max(3),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: setupOrganizationStep2,
    onSuccess: (organization: any) => {
      if (organization.errors) {
        throw new Error(organization.errors[0].message);
      }
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
      const organizationId: string | undefined = user?.organizations[0]?.id;
      if (organizationId) {
        mutate({ id: organizationId, formdata: data });
      }
    },
  });

  useEffect(() => {
    if (orgDetail.isSuccess) {
      setupOrganizationStep2Form.setFieldValue(
        "companySize",
        organization?.company_size
      );
      const index = sizes.indexOf(organization?.company_size);
      setSelected(index);
    }
  }, [orgDetail.data]);

  return (
    <form onSubmit={setupOrganizationStep2Form.handleSubmit} className="w-full">
      <div className="max-w-[50.875rem] mx-auto w-full pt-6">
        <header className="header text-slate-700 text-2xl font-medium leading-8 w-full ">
          What is the size of your company?*
        </header>
        <div className="company grid grid-cols-3 gap-4 mt-6 pr-[137px]">
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
                  : "border-2 border-[#64748B] text-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="actions-container justify-between items-center flex w-full gap-5 mt-6 px-2.5 py-5 max-md:max-w-full max-md:flex-wrap">
          <p
            onClick={() => setStep(1)}
            className="back-button text-blue-600 text-center text-sm font-bold cursor-pointer leading-4 my-auto"
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

const Step3 = ({ setStep, user }: any) => {
  // const session = useSession();
  const validation = z.object({
    naicsCode: z.string().regex(/^[0-9]{4,5}$/, "NAICS codes are 4-5 digits"),
    profileStep: z.number().int().min(1).max(3),
  });

  const orgDetail = useQuery({
    queryKey: ["org-naics"],
    queryFn: () => getOrganizationDetails(user?.organizations[0]?.id!),
  });
  const organization = orgDetail.isSuccess ? orgDetail.data.data : {};

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step3"],
    mutationFn: setupOrganizationStep3,
    onSuccess: (organization) => {
      if (organization.errors) {
        throw new Error(organization.errors[0].message);
      }
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
    validateOnChange: false,
    onSubmit: (data: any) => {
      const organizationId: string | undefined = user?.organizations[0]?.id;
      if (organizationId) {
        mutate({ id: organizationId, formdata: data });
      }
    },
  });

  useEffect(() => {
    if (orgDetail.isSuccess) {
      setupOrganizationStep3Form.setFieldValue(
        "naicsCode",
        organization?.naics_code
      );
    }
  }, [orgDetail.data]);

  return (
    <form onSubmit={setupOrganizationStep3Form.handleSubmit}>
      <div className="max-w-[50.875rem] pt-6">
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
          value={setupOrganizationStep3Form.values?.naicsCode}
          placeholder="Add NAICS code"
          onChange={setupOrganizationStep3Form.handleChange}
          className={cn(
            "text-slate-500 text-sm font-light leading-4 items-stretch self-center bg-gray-50 w-[814px] max-w-full justify-center mt-6 px-2 py-7 rounded-md max-md:max-w-full",
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
            onClick={() => setStep(2)}
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

const Step4 = ({ setStep, user }: any) => {
  const router = useRouter();
  // const session = useSession();
  const [targets, setTargets] = useState<string[]>([]);
  const [currentTarget, setCurrentTarget] = useState<string>("");
  const validation = z.object({
    climateTargets: z.array(z.string()).refine(
      (arr) => {
        return (
          arr.length >= 1 &&
          arr.every(
            (target) => typeof target === "string" && target.length <= 50
          )
        );
      },
      {
        message:
          "Climate targets should be an array with at least one string element, each string should be at most 50 characters long",
      }
    ),
    profileStep: z.number().int().min(1).max(3),
  });

  const orgDetail = useQuery({
    queryKey: ["org-targets"],
    queryFn: () => getOrganizationDetails(user?.organizations[0]?.id!),
  });
  const organization = orgDetail.isSuccess ? orgDetail.data.data : {};

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: setupOrganizationStep4,
    onSuccess: (organization) => {
      if (organization.errors) {
        throw new Error(organization.errors[0].message);
      }
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
      profileStep: 4,
    },
    // validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data: any) => {
      const organizationId: string | undefined = user?.organizations[0]?.id;

      const newTargets =
        currentTarget != "" ? [...targets, currentTarget] : targets;
      if (organizationId) {
        mutate({
          id: organizationId,
          formdata: { ...data, climateTargets: newTargets },
        });
      }

      router.push("/");
    },
  });

  const removeTarget = (index: any) => {
    setTargets((prevTargets) => prevTargets.filter((_, i) => i !== index));
  };
  // console.log("Form Errors : ", setupOrganizationStep4Form.errors);

  useEffect(() => {
    if (orgDetail.isSuccess) {
      setupOrganizationStep4Form.setFieldValue(
        "climateTargets",
        organization?.climate_targets
      );

      setTargets(
        organization?.climate_targets == null
          ? []
          : organization?.climate_targets
      );
    }
  }, [orgDetail.data]);

  return (
    <form onSubmit={setupOrganizationStep4Form.handleSubmit}>
      <div className="justify-center items-start flex max-w-[814px] w-full flex-col">
        <div role="group" className="mt-6 flex flex-col">
          <p className="text-slate-700 text-2xl font-medium">
            Do you have goals or targets to reduce greenhouse gas emissions
            and/or energy?
          </p>
          <p className="text-slate-500 text-sm font-light leading-5 my-6 ">
            For example, Science Based Target initiatives or commitments that
            are climate related (ex: Carbon neutral by 2040, Net Zero by 2030).
          </p>
          {targets?.length > 0 && (
            <div className="items-stretch self-stretch rounded  flex max-w-[814px] gap-x-4 gap-y-2.5 w-full mx-auto p-2.5 flex-wrap max-h-[128px] overflow-auto">
              {targets.map((target, index) => (
                <div
                  key={index}
                  className="justify-between items-center border border-green-100 bg-green-50 flex gap-0.5 px-2.5 py-2 rounded-md border-solid"
                >
                  <div className="text-green-800 text-xs font-medium leading-4 grow whitespace-nowrap">
                    {target}
                  </div>

                  <button onClick={() => removeTarget(index)}>
                    <X size={12} className="text-green-800" />{" "}
                  </button>
                  {/* Add the cross button */}
                </div>
              ))}
            </div>
          )}

          <div>
            <Input
              type="text"
              name="targets"
              value={currentTarget}
              onChange={(e) => {
                setCurrentTarget(e.target.value);
              }}
              className="text-slate-500 text-sm font-light leading-4 bg-gray-50 self-stretch mt-2 px-2 py-6 rounded-md"
              placeholder={
                targets?.length > 0
                  ? "Add another climate target"
                  : "ex: Carbon neutral by 2030"
              }
            />

            <p
              className={cn(
                "text-slate-500 text-xs font-light mt-1",
                currentTarget.length > 50 && "text-red-500"
              )}
            >
              {currentTarget.length}/50 Characters
            </p>
          </div>
          <button
            onClick={() => {
              const targetCopy = currentTarget;
              if (currentTarget) {
                setTargets([...targets, targetCopy]);
              }
              setCurrentTarget("");
            }}
            className="text-blue-600 text-end text-sm font-bold leading-4 whitespace-nowrap mt-4 disabled:cursor-not-allowed "
            type="button"
            disabled={currentTarget.length > 50}
          >
            + Add another target
          </button>
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
              onClick={() => router.push("/")}
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
                disabled={currentTarget.length > 50 || isPending}
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

export default Page;
