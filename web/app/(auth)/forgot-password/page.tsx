"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const validation = z.object({
    email: z.string().email(),
  });
  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: toFormikValidationSchema(validation),
    validateOnChange: false,
    onSubmit: (data) => {
      console.log(data);
      router.push(`/forgot-password?email=${data.email}`);
    },
  });

  const email = searchParams.get("email");
  function maskEmail(email: string) {
    // Split the email address into local and domain parts
    const [localPart, domain] = email.split("@");

    // Replace characters in the local part with asterisks
    const maskedLocalPart =
      localPart.substring(0, 2) +
      "*".repeat(localPart.length - 4) +
      localPart.slice(-2);

    // Concatenate the masked local part and the domain
    const maskedEmail = `${maskedLocalPart}@${domain}`;

    return maskedEmail;
  }

  return (
    <div className="h-screen grid place-items-center">
      {!email ? (
        <form
          onSubmit={handleSubmit}
          className="justify-center items-center border border-[#E5E7EB] w-full shadow-sm flex max-w-[828px] flex-col py-12 rounded-lg border-solid"
        >
          <img
            loading="lazy"
            // src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c31c226fc0c71362158bd2a54e4d2b381d4680c739e010c167fd3d08f46c8af?apiKey=011554aff43544e6af46800a427fd184&"
            src="/assets/images/C3Logo.svg"
            className="aspect-[0.95] object-contain object-center w-[107px] fill-[linear-gradient(180deg,#39775F_81.94%,#3A9B8C_105.47%)] overflow-hidden self-center max-w-full mt-16 max-md:mt-10"
            alt="Password Reset Logo"
          />

          <header className="text-neutral-900 text-3xl self-center whitespace-nowrap mt-14 max-md:mt-10">
            Forgot your password?
          </header>

          <div className="self-center text-neutral-500 text-center text-xs font-light leading-4 max-w-[346px] mt-14 max-md:mt-10">
            Just enter the email address associated with your account below, and
            well send you a link to reset your password.
            <br />
          </div>

          <div className="bg-gray-200 self-center w-[425px] shrink-0 max-w-full h-px mt-6" />

          <div className="justify-center items-center self-stretch flex w-full flex-col mt-6 mb-10 px-16 py-7 max-md:max-w-full max-md:mb-10 max-md:px-5">
            <div className="flex w-full max-w-[589px] flex-col items-center max-md:max-w-full">
              <label
                htmlFor="email"
                className="self-stretch text-slate-700 text-base font-light leading-6 max-md:max-w-full"
              >
                Email
              </label>

              <div className="w-full">
                <Input
                  id="email"
                  name="email"
                  onChange={handleChange}
                  className={cn(
                    "text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full",
                    errors.email && "border border-red-500"
                  )}
                  placeholder="Enter your email"
                />
                <p className="text-xs text-red-500 mt-[10px]">{errors.email}</p>
              </div>

              <Button
                className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch mt-9 px-4 py-3"
                type="submit"
              >
                Send reset link
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <form className="items-center border border-[color:var(--Gray-200,#E5E7EB)] flex max-w-[733px] flex-col px-20 py-12 rounded-md border-solid max-md:px-5">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7c99ce5646bfbeb4e52d2d4abd2068325d9dae23b361d208fcd6cd56b44d318f?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-[0.95] object-contain object-center w-[107px] fill-[linear-gradient(180deg,#39775F_81.94%,#3A9B8C_105.47%)] overflow-hidden self-center max-w-full mt-3.5"
            role="img"
            aria-label="Account Logo"
          />

          <h1 className="text-neutral-500 text-center text-3xl font-bold leading-8 self-center whitespace-nowrap mt-10">
            {" "}
            Account Recovery{" "}
          </h1>

          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/65546e78bc1c56d1655225438ad5c3958c9fd13b0f5100ba608326af0166120c?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-square object-contain object-center w-6 overflow-hidden self-center max-w-full mt-10"
            role="img"
            aria-label="Key Logo"
          />

          <p className="self-center text-slate-700 text-base leading-6 mt-6 max-md:max-w-full">
            {" "}
            We sent a password reset link to:{" "}
            <span className="font-bold">{maskEmail(email)}</span>{" "}
          </p>

          <hr className="bg-gray-200 self-center w-[425px] shrink-0 max-w-full h-px mt-6" />

          <p className="text-slate-700 text-center text-xs font-medium leading-5 self-stretch mt-6 max-md:max-w-full">
            {" "}
            Didn’t receive the email?{" "}
          </p>

          <section className="text-blue-700 text-center text-xs font-medium leading-5 self-stretch mt-3 max-md:max-w-full">
            <div className="font-light leading-4">
              Check your spam folder to make sure it didn’t end up there.
            </div>

            <div className="font-light leading-4">
              Try resending the email
              <a className="font-light leading-4 text-blue-700" href="#">
                {" "}
                by clicking here{" "}
              </a>
            </div>
          </section>

          <Link
            href="/login"
            className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center mt-6 mb-40 px-4 py-3 max-md:mb-10"
          >
            Back to login
          </Link>
        </form>
      )}
    </div>
  );
}

export default Page;
