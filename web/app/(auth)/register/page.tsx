"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import {
  register,
  registerOrganisation,
  registerStep2,
} from "@/services/auth.api";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { cn } from "@/lib/utils";
import Tick from "@/components/icons/Tick";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import AutocompleteInput from "@/components/Autocomplete";
import Image from "next/image";

export default function Page() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [userSlug, setUserSlug] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSSOregistration, setiSSOregistration] = useState(false);
  const currentStep = searchParams.get("step");

  const steps: {
    [key: number]: ({ setCurrentStep, setUserId, userId }: any) => JSX.Element;
  } = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: RegistrationComplete,
  };

  let RegistrationSteps = Step1;
  switch (currentStep) {
    case "2":
      RegistrationSteps = Step2;
      break;
    case "3":
      RegistrationSteps = Step3;
      break;
    case "complete":
      RegistrationSteps = RegistrationComplete;
      break;
    case "setup-done":
      RegistrationSteps = AccountSetupComplete;
      break;
    default:
      RegistrationSteps = Step1;
  }

  const stepper =
    currentStep == ("complete" || "setup-done") ? "4" : currentStep;

  return (
    <>
      <div
        className={`h-3 absolute top-0 left-0 z-30 rounded-r-full bg-[#598E69]`}
        style={{ width: `${(parseInt(stepper!) / 4) * 100}vw` }}
      />
      <div className="flex container justify-between h-screen w-full">
        <div>
          <RegistrationSteps
            ssoReg={isSSOregistration}
            setSSOReg={setiSSOregistration}
            setUserId={setUserId}
            userId={userId}
            setUserSlug={setUserSlug}
            userSlug={userSlug}
            setUserEmail={setUserEmail}
            userEmail={userEmail}
          />
        </div>

        <div className="flex-1 mt-9 max-w flex flex-col items-end">
          <header className="header flex justify-end mb-[6px]">
            <img
              loading="lazy"
              src="/assets/images/Logo.png"
              className="w-[177px] overflow-hidden max-w-full"
              alt=""
            />
          </header>
          <div
            style={{
              background: "url(/assets/images/gradient.png)",
            }}
            className="bg-gray-700/50 bg-blend-screen w-[579px] h-[787.951px] bg-cover rounded-md flex flex-col items-center pt-[5.28rem]"
          >
            <img
              src={"/assets/images/gradient-inside.png"}
              alt="signup image"
              width={540}
              height={406.6}
              className="shadow-lg"
            />
            <div className="pt-[4.23rem] space-y-4">
              <div className="gap-3 flex items-center text-sm text-white">
                <Check size={16} className="text-white" /> Quantify your supply
                chain emissions by product line
              </div>
              <div className="gap-3 flex items-center text-sm text-white">
                <Check size={16} className="text-white" /> Collaboratively
                engage in carbon abatement projects
              </div>
              <div className="gap-3 flex items-center text-sm text-white">
                <Check size={16} className="text-white" /> Provide buyers with
                transparent carbon emissions insights
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Step1 = ({ setSSOReg, setUserId }: any) => {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const isInvited = searchParams.get("invited");
  const invitedEmail = searchParams.get("email");
  const isSupplier = searchParams.get("isSupplier");
  const social = searchParams.get("social");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const validation = z.object({
    email: z.string().email(),
  });
  const passwordValidation = z
    .object({
      password: z.string(),
    })
    .superRefine((val, ctx) => {
      if (val.password.length < 8) {
        ctx.addIssue({ code: "custom", message: "length" });
      }
      if (!/[A-Z]/.test(val.password)) {
        ctx.addIssue({ code: "custom", message: "uppercase" });
      }

      if (!/[a-z]/.test(val.password)) {
        ctx.addIssue({ code: "custom", message: "lowercase" });
      }
      if (!/[0-9]/.test(val.password)) {
        ctx.addIssue({ code: "custom", message: "number" });
      }
      if (!/[^A-Za-z0-9]/.test(val.password)) {
        ctx.addIssue({ code: "custom", message: "special" });
      }
    });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: register,
    onSuccess: (user) => {
      if (user.errors) {
        throw new Error(user.errors[0].message);
      }

      setUserId(user.duserata?.id);
      if (invitedEmail) {
        router.push(`/register?step=2&invited=true&slug=${user.data?.slug}`);
        return;
      }

      if (isSupplier == "true") {
        router.push(`/register?step=2&isSupplier=true&slug=${user.data?.slug}`);
        return;
      }

      router.push(`/register?step=2&slug=${user.data?.slug}`);
      // setCurrentStep(2);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const registerForm = useFormik({
    initialValues: {
      email: "",
      password: "",
      registrationStep: 1,
      invitedUser: false,
    },
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: async (data) => {
      if (errors.length > 0) {
        return;
      }
      if (invitedEmail) {
        const res = await signIn("credentials", {
          ...data,
          isInvited: true,
          redirect: false,
        });
        if (res?.ok) {
          router.push("/register?step=2&invited=true");
        }
        if (res?.error) {
          toast.error(res.error, { style: { color: "red" } });
        }

        return;
      }
      mutate({
        ...data,
        invitedUser: false,
        isSupplier: isSupplier == "true" ? true : false,
      });
    },
  });

  const handleSignIn = async (provider: string) => {
    const res = await signIn(provider, { redirect: false, callbackUrl: "/" });
  };

  useEffect(() => {
    if (invitedEmail) {
      registerForm.setFieldValue("email", invitedEmail);
    }
  }, []);

  return (
    <div className="items-center flex flex-1 max-w-[840px] w-full flex-col px-20 py-12 max-md:px-5">
      <header className="header justify-center text-neutral-900 text-center text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl">
        Create your account
      </header>
      {social != "true" ? (
        <form onSubmit={registerForm.handleSubmit} className="w-full">
          <div className="input-wrapper justify-center items-stretch self-stretch flex flex-col mt-14 py-6 max-md:max-w-full max-md:mr-2.5 max-md:mt-10 max-md:px-5">
            <label
              htmlFor="email"
              className="label text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            >
              Work email*
            </label>
            <div
              className={cn(
                "input text-slate-500 text-xs font-light leading-4  items-stretch bg-gray-50 justify-center mt-3 px-2 rounded-md max-md:max-w-full",
                registerForm.errors.email && "border border-red-500"
              )}
            >
              <Input
                className={
                  "w-full bg-transparent disabled:text-slate-900 px-0 h-[69px]"
                }
                id="email"
                name="email"
                disabled={!!invitedEmail}
                value={registerForm.values.email}
                onBlur={() => registerForm.validateField("email")}
                onChange={registerForm.handleChange}
                placeholder="Email"
              />
            </div>
            <p className="text-red-500 text-xs mt-[10px]">
              {registerForm.errors.email}
            </p>
            <label
              htmlFor="password"
              className="label text-slate-700 text-base font-light leading-6 mt-10 max-md:max-w-full"
            >
              Create your password*
            </label>
            <div
              className={cn(
                "input-group items-stretch bg-gray-50 flex justify-between gap-2 mt-3 px-2 rounded-md max-md:max-w-full max-md:flex-wrap"
              )}
            >
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full bg-transparent px-0 h-[69px]"
                name="password"
                onChange={(e) => {
                  registerForm.handleChange(e);
                  const value = e.target.value;
                  const values = { password: value };

                  const result = passwordValidation.safeParse(values);

                  if (!result.success) {
                    setErrors(result.error.format()._errors);
                  } else {
                    setErrors([]);
                  }
                }}
                placeholder="Password"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center cursor-pointer"
              >
                {showPassword ? (
                  <Eye size={16} color="#64748B" />
                ) : (
                  <EyeOff size={16} color="#64748B" />
                )}
              </div>
            </div>
            <div className="input-group items-stretch flex justify-between gap-5 mt-10 max-md:max-w-full max-md:flex-wrap">
              <div className="input-help items-stretch flex grow basis-[0%] flex-col">
                <div className="input-help-item items-stretch flex justify-between gap-2">
                  <Tick
                    variant={
                      registerForm.values.password != ""
                        ? // ? registerForm.errors.password?.includes("lowercase")
                          errors.includes("lowercase")
                          ? "red"
                          : "green"
                        : "gray"
                    }
                  />
                  <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow whitespace-nowrap self-start">
                    One lowercase character
                  </div>
                </div>
                <div className="input-help-item items-stretch flex justify-between gap-2 mt-2.5">
                  <Tick
                    variant={
                      registerForm.values.password != ""
                        ? // ? registerForm.errors.password?.includes("uppercase")
                          errors.includes("uppercase")
                          ? "red"
                          : "green"
                        : "gray"
                    }
                  />
                  <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow whitespace-nowrap self-start">
                    One uppercase character
                  </div>
                </div>
                <div className="input-help-item items-stretch flex gap-2 mt-2.5">
                  <Tick
                    variant={
                      registerForm.values.password != ""
                        ? registerForm.values.password.length < 8
                          ? "red"
                          : "green"
                        : "gray"
                    }
                  />
                  <div className="input-help-text text-zinc-950 text-opacity-30 text-sm">
                    8 characters minimum
                  </div>
                </div>
              </div>
              <div className="input-help items-stretch flex grow basis-[0%] flex-col self-start">
                <div className="input-help-item items-stretch flex justify-between gap-2">
                  <Tick
                    variant={
                      registerForm.values.password != ""
                        ? errors.includes("number")
                          ? "red"
                          : "green"
                        : "gray"
                    }
                  />
                  <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow shrink basis-auto self-start">
                    One number
                  </div>
                </div>
                <div className="input-help-item items-stretch flex justify-between gap-2 mt-2.5">
                  <Tick
                    variant={
                      registerForm.values.password != ""
                        ? errors.includes("special")
                          ? "red"
                          : "green"
                        : "gray"
                    }
                  />
                  <div className="input-help-text text-zinc-950 text-opacity-30 text-sm grow shrink basis-auto self-start">
                    One special character
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-wrapper justify-end flex items-center w-full space-x-2 py-2.5 max-md:max-w-full max-md:pl-5">
            {isPending && (
              <Loader2 size={30} className="text-slate-400 animate-spin" />
            )}
            <Button
              size={"lg"}
              disabled={isPending}
              type="submit"
              className="button text-base font-semibold leading-6 whitespace-nowrap px-6 py-4 max-md:px-5"
            >
              Continue
            </Button>
          </div>
          <div
            onClick={() => {
              router.push("?social=true");
            }}
            className="text-blue-700 text-center text-sm cursor-pointer font-bold leading-5 mt-6 max-md:max-w-full"
          >
            Or Sign Up with SSO
          </div>
          <div className="text-[#334155] text-center text-xs font-medium leading-5 mt-6 max-md:max-w-full">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-sm text-blue-700">
              Sign In
            </Link>
          </div>
          <div className="text-slate-700 text-center text-xs font-light leading-4 mt-6 max-md:max-w-full">
            By clicking &apos;Continue&apos; above, you agree to our{" "}
            <a href="/terms-of-service" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline">
              Privacy Policy.
            </a>
          </div>
        </form>
      ) : (
        <div className="items-stretch bg-white flex max-w-[408px] flex-col px-16 py-12 rounded-lg">
          <div
            role="button"
            onClick={() => handleSignIn("google")}
            className="justify-start items-stretch border-slate-200 flex gap-4 mt-3.5 py-4 px-11 rounded-full border-2 border-solid"
          >
            <img
              loading="lazy"
              src="/assets/images/google-logo.svg"
              className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-slate-800 text-base font-medium leading-6 tracking-tight grow whitespace-nowrap">
              Sign in with Google
            </div>
          </div>
          <div
            role="button"
            onClick={() => handleSignIn("azure-ad")}
            className="justify-start items-stretch border-slate-200 flex gap-4 mt-6 py-4 px-11  rounded-full border-2 border-solid"
          >
            <img
              loading="lazy"
              src="/assets/images/microsoft-logo.svg"
              className="aspect-square object-contain object-center w-6 justify-center items-center overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-slate-800 text-base font-medium leading-6 tracking-tight grow whitespace-nowrap">
              Sign in with Microsoft
            </div>
          </div>
          <Link
            href={"/register"}
            className="text-blue-700 text-sm font-bold cursor-pointer leading-5 self-center whitespace-nowrap mt-6"
          >
            Sign in without SSO
          </Link>
          <Link
            href="/login"
            className="text-slate-700 text-sm leading-5 underline self-center whitespace-nowrap mt-6 mb-3.5"
          >
            Have an account? Sign in
          </Link>
        </div>
      )}
    </div>
  );
};

const Step2 = ({ ssoReg, setSSOReg, userId, setUserSlug }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isInvited = searchParams.get("invited");
  const slug = searchParams.get("slug");
  const isSupplier = searchParams.get("isSupplier");

  const validation = z.object({
    firstName: z
      .string()
      .min(2, "First Name should contain at least 2 characters")
      .max(30, "First Name should contain at most 30 characters")
      .refine((val) => /^[a-zA-Z ]*$/.test(val), {
        message: "Name should contain only alphabets",
      }),
    lastName: z
      .string()
      .min(2, "Last Name should contain at least 2 characters")
      .max(30, "Last Name should contain at most 30 characters")
      .refine((val) => /^[a-zA-Z ]*$/.test(val), {
        message: "Name should contain only alphabets",
      }),
  });
  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step2"],
    mutationFn: registerStep2,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      if (isInvited == "true") {
        router.push(`/register?step=setup-done&slug=${data.data?.slug}`);
        return;
      }
      if (isSupplier == "true") {
        router.push(`/register?step=3&slug=${data.data?.slug}&isSupplier=true`);
        return;
      }

      router.push(`/register?step=3&slug=${data.data?.slug}`);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });
  const step2Form = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      registrationStep: 2,
    },
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data) => {
      if (isInvited == "true" && session) {
        mutate({
          id: session?.user?.slug,
          formdata: {
            ...data,
            invitedUser: isInvited == "true" ? true : false,
            isSupplier: isSupplier == "true" ? true : false,
          },
        });
        return;
      }
      mutate({
        id: slug!,
        formdata: {
          ...data,
          invitedUser: isInvited == "true" ? true : false,
          isSupplier: isSupplier == "true" ? true : false,
        },
      });
    },
  });

  if (isInvited == "true" && session?.user.first_name) {
    router.push("/register?step=setup-done");
  }

  return (
    <form
      onSubmit={step2Form.handleSubmit}
      className="items-center flex max-w-[840px] flex-1 flex-col px-20 py-12 max-md:px-5"
    >
      <header className="justify-center text-neutral-900 text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl">
        What&apos;s your name?
      </header>
      <div className="justify-center items-stretch self-stretch space-y-10 flex flex-col mt-14 mb-52 py-6 max-md:max-w-full max-md:mr-2.5 max-md:my-10 max-md:px-5">
        <div>
          <label
            className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            htmlFor="firstNameInput"
          >
            First Name
          </label>
          <div
            className={cn(
              "text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 rounded-md max-md:max-w-full",
              step2Form.errors.firstName && "border border-red-500"
            )}
          >
            <Input
              type="text"
              id="firstNameInput"
              placeholder="First Name"
              name="firstName"
              onChange={step2Form.handleChange}
              className="bg-transparent px-0 h-[69px]"
            />
          </div>
          <p className="text-xs text-red-500 mt-[10px]">
            {step2Form.errors.firstName}
          </p>
        </div>
        <div>
          <label
            className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            htmlFor="lastNameInput"
          >
            Last Name
          </label>
          <div
            className={cn(
              "text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 justify-center mt-3 px-2 rounded-md max-md:max-w-full",
              step2Form.errors.lastName && "border border-red-500"
            )}
          >
            <Input
              type="text"
              id="lastNameInput"
              className="bg-transparent px-0 h-[69px]"
              name="lastName"
              onChange={step2Form.handleChange}
              placeholder="Last Name"
            />
          </div>
          <p className="text-xs text-red-500 mt-[10px]">
            {step2Form.errors.lastName}
          </p>
        </div>

        <div className="justify-end flex pl-16 pr-2.5 py-2.5 items-center max-md:max-w-full max-md:pl-5">
          {isPending && (
            <Loader2 size={30} className="text-slate-400 animate-spin" />
          )}
          <Button
            disabled={
              Object.values(step2Form.values.firstName).length === 0 ||
              Object.values(step2Form.values.lastName).length === 0 ||
              isPending
            }
            className="text-white text-center text-base font-semibold leading-6 whitespace-nowrap justify-center px-6 py-4 max-md:px-5"
            type="submit"
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
};

const Step3 = ({ userSlug, setUserEmail }: any) => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const isSupplier = searchParams.get("isSupplier");
  const [isEdit, setEdit] = useState(false);
  const [address, setAddress] = useState("");

  const validation = z.object({
    companyName: z
      .string()
      .min(2, "Company Name should contain at least 2 characters")
      .max(50, "Company Name should contain at most 50 characters"),

    companyAddress: z
      .string()
      .max(500, "Address should contain at most 255 characters"),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: registerOrganisation,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setUserEmail(data.data.email);
      // setCurrentStep(4);

      // update({ orgs: data.data.organizations });
      if (session) {
        router.push("/create-organisation");
      } else {
        router.push("/register?step=complete");
      }
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const step3Form = useFormik({
    initialValues: {
      companyName: "",
      companyAddress: "",
      registrationStep: 3,
      isSupplier: false,
    },
    validationSchema: toFormikValidationSchema(validation),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: (data) => {
      if (!slug) {
        mutate({
          ...data,
          userSlug: session?.user.slug,
          isSupplier: isSupplier == "true" ? true : false,
        });
      } else {
        mutate({
          ...data,
          userSlug: slug,
          isSupplier: isSupplier == "true" ? true : false,
        });
      }
    },
  });

  return (
    <form
      onSubmit={step3Form.handleSubmit}
      className="items-center flex max-w-[840px] flex-col justify-center px-16 py-12 max-md:px-5"
    >
      <header className="flex w-full max-w-[581px] flex-col mt-5 max-md:max-w-full max-md:mb-10">
        <h1 className="justify-center text-neutral-900 text-center whitespace-nowrap text-6xl font-semibold self-stretch max-md:max-w-full max-md:text-4xl">
          Where do you work?
        </h1>
      </header>
      <div className="w-full max-md:mt-10 mt-14">
        <div>
          <label
            className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            htmlFor="companyName"
          >
            Company Name
          </label>

          <div>
            <Input
              type="text"
              id="companyName"
              name="companyName"
              onChange={step3Form.handleChange}
              placeholder="Company Name"
              className={cn(
                "text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 h-[69px] rounded-md max-md:max-w-full",
                step3Form.touched.companyName &&
                  step3Form.errors.companyName &&
                  "border border-red-500"
              )}
            />
            {step3Form.touched.companyName && (
              <p className="text-xs text-red-500 mt-[10px]">
                {step3Form.errors.companyName}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-end mb-3 py-2">
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="companyAdress"
            >
              Company Address
            </label>
            {step3Form.values.companyAddress != "" && (
              <p
                role="button"
                onClick={() => setEdit(true)}
                className="text-sm font-semibold leading-4 text-blue-600"
              >
                Edit
              </p>
            )}
          </div>

          <div className="max-w-[582px] h-[69px] ">
            <AutocompleteInput
              isDisabled={!isEdit}
              setAddress={(e: any) => {
                step3Form.setFieldValue("companyAddress", e);
                setEdit(false);
              }}
            />
            {step3Form.touched.companyAddress && (
              <p className="text-red-500 text-xs mt-[10px]">
                {step3Form.errors?.companyAddress}
              </p>
            )}
          </div>
        </div>

        <div className="justify-between items-center self-stretch flex gap-5 mt-8 pl-1 pr-2.5 py-2.5 max-md:max-w-full max-md:flex-wrap">
          <div className="text-blue-600 text-center text-sm font-semibold leading-4 my-auto">
            {/* <Button
              variant={"ghost"}
              className="font-semibold px-0 hover:bg-transparent"
              type="button"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button> */}
          </div>
          <div className="flex space-x-2 items-center">
            {isPending && (
              <Loader2 size={30} className="text-slate-400 animate-spin" />
            )}
            <Button
              size={"lg"}
              type="submit"
              disabled={
                Object.values(step3Form.values.companyName).length === 0 ||
                Object.values(step3Form.values.companyAddress).length === 0 ||
                isPending
              }
              className="text-white text-center text-base font-semibold leading-6 whitespace-nowrap items-stretch rounded self-stretch justify-center px-6 py-4 max-md:px-5"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

const RegistrationComplete = ({ userEmail }: any) => {
  return (
    <div className="items-center flex max-w-[840px] flex-col justify-center px-16 py-12 max-md:px-5">
      <header className="flex w-full max-w-[581px] flex-col mt-5 max-md:max-w-full max-md:mb-10">
        <h1 className="justify-center text-neutral-900 text-center text-6xl font-semibold self-stretch max-md:max-w-full max-md:text-4xl">
          Your account has been created
        </h1>
      </header>
      <p className="mt-6 py-8 max-w-[581px]">
        We sent you an email to <strong>{userEmail}</strong>. Check your inbox
        to activate your account.
      </p>
      <Link
        href={"/login"}
        className="rounded bg-blue-600 hover:bg-blue-600/90 px-4 py-1 text-white text-sm font-semibold"
      >
        Back to Login
      </Link>
    </div>
  );
};

const AccountSetupComplete = ({ userEmail }: any) => {
  return (
    <div className="items-center flex max-w-[840px] flex-col justify-center px-16 py-12 max-md:px-5">
      <header className="flex w-full max-w-[581px] flex-col mt-5 max-md:max-w-full max-md:mb-10">
        <h1 className="justify-center text-neutral-900 text-center text-[3.5rem] font-semibold self-stretch max-md:max-w-full max-md:text-4xl">
          Your account has been set up
        </h1>
      </header>
      <p className="mt-6 py-8 max-w-[581px] text-center">
        Tap continue to head to the Terralab platform
      </p>
      <Link
        href={"/"}
        className="rounded bg-blue-600 hover:bg-blue-600/90 px-4 py-1 text-white text-sm font-semibold"
      >
        Continue
      </Link>
    </div>
  );
};
