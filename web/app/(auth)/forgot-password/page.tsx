"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { forgotPassword } from "@/services/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Mail } from "lucide-react";

function Page() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const [email, setEmail] = React.useState<string | null>(null);
  const router = useRouter();
  const validation = z.object({
    email: z.string().email(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message, { style: { color: "green" } });
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const forgotPasswordForm = useFormik({
    initialValues: {
      email: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: async (data) => {
      setEmail(data.email);
      mutate({ email: data.email });
    },
  });

  function maskEmail(email: string) {
    // Split the email address into local and domain parts
    const localPart = email?.split("@")[0];
    const domain = email?.split("@")[1];

    // Replace characters in the local part with asterisks
    const maskedLocalPart =
      localPart?.substring(0, 2) +
      "*".repeat(localPart.length - 4) +
      localPart?.slice(-2);

    // Concatenate the masked local part and the domain
    const maskedEmail = `${maskedLocalPart}@${domain}`;

    return maskedEmail;
  }

  return (
    <div className="h-screen grid place-items-center">
      {!email ? (
        <form
          onSubmit={forgotPasswordForm.handleSubmit}
          className="justify-center items-center border border-[#E5E7EB] w-full shadow-sm flex max-w-[828px] flex-col py-12 rounded-lg border-solid"
        >
          <img
            loading="lazy"
            src={"/assets/images/Logo.png"}
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

              <Input
                id="email"
                type="email"
                name="email"
                onChange={forgotPasswordForm.handleChange}
                // className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full"
                className={cn(
                  "text-slate-500 text-xs font-light leading-4 items-stretch self-center bg-gray-50 w-[814px] max-w-full justify-center mt-6 px-2 py-7 rounded-md max-md:max-w-full",
                  forgotPasswordForm.touched.email &&
                    forgotPasswordForm.errors.email &&
                    "border border-red-500"
                )}
                placeholder="Enter your email"
              />

              <p className="text-red-500 text-xs mt-[10px]">
                {forgotPasswordForm.errors.email as React.ReactNode}
              </p>

              <Button
                disabled={isPending}
                className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch mt-9 px-4 py-3"
                type="submit"
              >
                Send reset link
              </Button>

              <Link href={"/login"} className="pt-6">
                <Button
                  type="button"
                  variant={"ghost"}
                  className="text-blue-700 hover:text-blue-700 font-bold"
                >
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </form>
      ) : (
        <form className="items-center border border-[color:var(--Gray-200,#E5E7EB)] flex max-w-[733px] flex-col px-20 py-12 rounded-md border-solid max-md:px-5">
          <img
            loading="lazy"
            src={"/assets/images/Logo.png"}
            className="aspect-[0.95] object-contain object-center w-[177px] fill-[linear-gradient(180deg,#39775F_81.94%,#3A9B8C_105.47%)] overflow-hidden self-center max-w-full mt-3.5"
            role="img"
            aria-label="Account Logo"
          />

          <h1 className="text-neutral-500 text-center text-3xl font-bold leading-8 self-center whitespace-nowrap">
            Account Recovery
          </h1>

          <Mail width={24} height={24} className="text-slate-700 mt-6" />

          <p className="self-center text-slate-700 text-base leading-6 mt-6 max-md:max-w-full">
            We sent a password reset link to:{" "}
            <span className="font-bold">
              {email && maskEmail(email as string)}
            </span>
          </p>

          <hr className="bg-gray-200 self-center w-[425px] shrink-0 max-w-full h-px mt-4" />

          <p className="text-slate-700 text-center text-xs font-medium leading-5 self-stretch mt-6 max-md:max-w-full">
            Didn&apos;t receive the email?
          </p>

          <section className="text-center text-xs font-medium leading-5 self-stretch mt-3 max-md:max-w-full">
            <div className="font-light leading-4">
              Check your spam folder to make sure it didn&apos;t end up there.
            </div>

            <div className="font-light leading-4">
              Try resending the email
              <span
                role="button"
                onClick={() => setEmail(null)}
                className="font-light leading-4 text-blue-700"
              >
                {" "}
                by clicking here{" "}
              </span>
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
