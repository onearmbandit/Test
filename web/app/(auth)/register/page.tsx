"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
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
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [userSlug, setUserSlug] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSSOregistration, setiSSOregistration] = useState(false);
  const steps: {
    [key: number]: ({ setCurrentStep, setUserId, userId }: any) => JSX.Element;
  } = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: RegistrationComplete,
  };
  const RegistraionSteps = steps[currentStep];

  return (
    <>
      <div
        className={`h-3 absolute top-0 left-0 z-30 rounded-r-full bg-[#598E69]`}
        style={{ width: `${(currentStep / 4) * 100}vw` }}
      />
      <div className="flex container justify-between h-screen w-full">
        <div>
          <RegistraionSteps
            setCurrentStep={setCurrentStep}
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
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/016980bf7cc1c4d078e3f7a80bdae9db28bcd1f4fc12c0dde3b4f3f84f917e53?apiKey=011554aff43544e6af46800a427fd184&"
              className="aspect-[6.81] object-contain object-center w-[177px] overflow-hidden max-w-full"
              alt=""
            />
          </header>
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/2617de5a-f3cc-40b2-95cc-1b4a8d1167e4?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-[0.73] object-contain object-center w-full overflow-hidden max-w-xl"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

const Step1 = ({ setCurrentStep, setSSOReg, setUserId }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const validation = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step1"],
    mutationFn: register,
    onSuccess: (user) => {
      setUserId(user.data.id);
      setCurrentStep(2);
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
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data) => {
      mutate(data);
    },
  });

  return (
    <form
      onSubmit={registerForm.handleSubmit}
      className="items-center flex flex-1 max-w-[840px] w-full flex-col px-20 py-12 max-md:px-5"
    >
      <header className="header justify-center text-neutral-900 text-center text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl">
        Create your account
      </header>
      <div className="input-wrapper justify-center items-stretch self-stretch flex flex-col mt-14 py-6 max-md:max-w-full max-md:mr-2.5 max-md:mt-10 max-md:px-5">
        <label
          htmlFor="email"
          className="label text-slate-700 text-base font-light leading-6 max-md:max-w-full"
        >
          Work email*
        </label>
        <div
          className={cn(
            "input text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full",
            registerForm.errors.email && "border border-red-500"
          )}
        >
          <Input
            className={"w-full bg-transparent"}
            id="email"
            name="email"
            onChange={registerForm.handleChange}
            placeholder="Email"
          />
        </div>
        <label
          htmlFor="password"
          className="label text-slate-700 text-base font-light leading-6 mt-10 max-md:max-w-full"
        >
          Create your password*
        </label>
        <div
          className={cn(
            "input-group items-stretch bg-gray-50 flex justify-between gap-2 mt-3 px-2 py-7 rounded-md max-md:max-w-full max-md:flex-wrap",
            registerForm.errors.password && "border border-red-500"
          )}
        >
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-full bg-transparent"
            name="password"
            onChange={registerForm.handleChange}
            placeholder="Password"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center cursor-pointer"
          >
            <Eye size={16} color="#64748B" />
          </div>
        </div>
        <div className="input-group items-stretch flex justify-between gap-5 mt-10 max-md:max-w-full max-md:flex-wrap">
          <div className="input-help items-stretch flex grow basis-[0%] flex-col">
            <div className="input-help-item items-stretch flex justify-between gap-2">
              <Tick
                variant={
                  registerForm.values.password != ""
                    ? registerForm.errors.password
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
                    ? registerForm.errors.password
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
                    ? registerForm.errors.password
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
                    ? registerForm.errors.password
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
                    ? registerForm.errors.password
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
          setCurrentStep(2);
          setSSOReg(true);
        }}
        className="text-blue-700 text-center text-sm cursor-pointer font-bold leading-5 mt-6 max-md:max-w-full"
      >
        Or Sign Up with SSO
      </div>
      <div className="text-blue-700 text-center text-xs font-medium leading-5 mt-6 max-md:max-w-full">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-sm text-blue-700">
          Sign In
        </Link>
      </div>
      <div className="text-slate-700 text-center text-xs font-light leading-4 mt-6 max-md:max-w-full">
        By clicking &apos;Continue&apos; above, you agree to our Terms of
        Service and Privacy Policy.
      </div>
    </form>
  );
};

const Step2 = ({
  setCurrentStep,
  ssoReg,
  setSSOReg,
  userId,
  setUserSlug,
}: any) => {
  const validation = z.object({
    firstName: z.string().refine((val) => /^[a-zA-Z ]*$/.test(val), {
      message: "Name should contain only alphabets",
    }),
    lastName: z.string().refine((val) => /^[a-zA-Z ]*$/.test(val), {
      message: "Name should contain only alphabets",
    }),
  });
  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["step2"],
    mutationFn: registerStep2,
    onSuccess: (data) => {
      setUserSlug(data.data.slug);
      setCurrentStep(3);
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
      console.log("user details", userId);

      mutate({ id: userId, formdata: data });
    },
  });
  return (
    <form
      onSubmit={step2Form.handleSubmit}
      className="items-center flex max-w-[840px] flex-1 flex-col px-20 py-12 max-md:px-5"
    >
      <header
        className="justify-center text-neutral-900 text-6xl font-semibold mt-5 max-md:max-w-full max-md:text-4xl"
        aria-label="Name Question"
      >
        Whats your name?
      </header>
      {!ssoReg ? (
        <div className="justify-center items-stretch self-stretch space-y-10 flex flex-col mt-14 mb-52 py-6 max-md:max-w-full max-md:mr-2.5 max-md:my-10 max-md:px-5">
          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="firstNameInput"
            >
              First Name
            </label>
            <div className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full">
              <Input
                type="text"
                id="firstNameInput"
                placeholder="First Name"
                name="firstName"
                onChange={step2Form.handleChange}
                className="bg-transparent"
              />
            </div>
          </div>
          <div>
            <label
              className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              htmlFor="lastNameInput"
            >
              Last Name
            </label>
            <div className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full">
              <Input
                type="text"
                id="lastNameInput"
                className="bg-transparent"
                name="lastName"
                onChange={step2Form.handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="justify-end flex pl-16 pr-2.5 py-2.5 items-center max-md:max-w-full max-md:pl-5">
            {isPending && (
              <Loader2 size={30} className="text-slate-400 animate-spin" />
            )}
            <Button
              disabled={isPending}
              className="text-white text-center text-base font-semibold leading-6 whitespace-nowrap justify-center px-6 py-4 max-md:px-5"
              type="submit"
            >
              Continue
            </Button>
          </div>
        </div>
      ) : (
        <div className="items-stretch bg-white flex max-w-[408px] flex-col px-16 py-12 rounded-lg">
          <span className="justify-between items-stretch border-slate-200 flex gap-4 mt-3.5 px-14 py-4 rounded-full border-2 border-solid">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/eadd558dbc7d09c4bec3f5674e44f92bc02c4b87986f6b7d500087b8fbc0f758?apiKey=011554aff43544e6af46800a427fd184&"
              className="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-slate-800 text-base font-medium leading-6 tracking-tight grow whitespace-nowrap">
              Sign in with Google
            </div>
          </span>
          <span className="justify-between items-stretch border-slate-200 flex gap-4 mt-6 px-11 py-4 rounded-full border-2 border-solid">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1a6ba0c98461a7f1e18f4fe452b9c4e38719d6d0d2cee2008d4113ff8af910d8?apiKey=011554aff43544e6af46800a427fd184&"
              className="aspect-square object-contain object-center w-6 justify-center items-center overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-slate-800 text-base font-medium leading-6 tracking-tight grow whitespace-nowrap">
              Sign in with Microsoft
            </div>
          </span>
          <div
            onClick={() => setSSOReg(false)}
            className="text-blue-700 text-sm font-bold cursor-pointer leading-5 self-center whitespace-nowrap mt-6"
          >
            Sign in without SSO
          </div>
          <a
            href="/login"
            className="text-slate-700 text-sm leading-5 underline self-center whitespace-nowrap mt-6 mb-3.5"
          >
            Have an account? Sign in
          </a>
        </div>
      )}
    </form>
  );
};

const Step3 = ({ setCurrentStep, userSlug, setUserEmail }: any) => {
  const validation = z.object({
    companyName: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z
      .string()
      .min(5)
      .refine((val) => /^-?\d*\.?\d+$/.test(val), {
        message: "Enter a valid zipcode.",
      }),
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: registerOrganisation,
    onSuccess: (data) => {
      console.log("success", data.data.email);
      setUserEmail(data.data.email);
      setCurrentStep(4);
    },
  });

  const step3Form = useFormik({
    initialValues: {
      userSlug,
      companyName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "MH",
      zipCode: "",
      registrationStep: 3,
    },
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data) => {
      console.log(data);
      mutate(data);
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

          <Input
            type="text"
            id="companyName"
            name="companyName"
            onChange={step3Form.handleChange}
            placeholder="Company"
            className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
          />
        </div>
        <div>
          <label
            className="text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            htmlFor="companyAdress"
          >
            Company Address
          </label>

          <Input
            type="text"
            id="companyAdress"
            name="addressLine1"
            onChange={step3Form.handleChange}
            placeholder="Street Address"
            className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
          />
        </div>
        <div>
          <Input
            type="text"
            name="addressLine2"
            onChange={step3Form.handleChange}
            placeholder="Apt, suite, floor, unit, etc"
            className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
          />
        </div>

        <div className="items-stretch self-stretch flex justify-between gap-5 mt-3 px-px max-md:max-w-full max-md:flex-wrap">
          <Input
            type="text"
            placeholder="City"
            name="city"
            onChange={step3Form.handleChange}
            className="text-slate-500 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-50 justify-center px-2 py-6 rounded-md max-md:max-w-full"
          />

          <div className="items-stretch bg-gray-50 flex justify-between gap-2 w-[35%] px-2 py-6 rounded-md">
            <div
              className="text-slate-500 text-sm font-light leading-5 grow whitespace-nowrap"
              aria-label="State"
            >
              State
            </div>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e2291a7397fc864d89d99afc7f9d8722720b9685dfa12431141c0d34998ec61f?apiKey=011554aff43544e6af46800a427fd184&"
              className="aspect-square object-contain object-center w-4 overflow-hidden self-center shrink-0 max-w-full my-auto"
              alt="State"
              aria-label="State"
            />
          </div>
        </div>
        <Input
          type="text"
          placeholder="Zipcode"
          name="zipCode"
          onChange={step3Form.handleChange}
          className="text-slate-500 text-sm font-light leading-5 items-stretch bg-gray-50 justify-center mt-3 px-2 py-6 rounded-md max-md:max-w-full"
        />

        <div className="justify-between items-center self-stretch flex gap-5 mt-3 pl-1 pr-2.5 py-2.5 max-md:max-w-full max-md:flex-wrap">
          <div className="text-blue-600 text-center text-sm font-semibold leading-4 my-auto">
            <Button
              variant={"ghost"}
              className="font-semibold px-0 hover:bg-transparent"
              type="button"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>
          </div>
          <div className="flex space-x-2 items-center">
            {isPending && (
              <Loader2 size={30} className="text-slate-400 animate-spin" />
            )}
            <Button
              size={"lg"}
              type="submit"
              disabled={isPending}
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
        We sent an email to <strong>{userEmail}</strong>. Check your inbox to
        activate your account.
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
