"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.api";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { signIn, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const Page = () => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const validation = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // console.log("success", data);
      localStorage.setItem("token", data.data.token.token);
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: async (data) => {
      // console.log(data);
      const res = await signIn("credentials", { ...data, redirect: false });
      if (res?.error) {
        toast.error(res.error, { style: { color: "red" } });
      }
    },
  });

  const socialParam = params.get("social");

  if (session) {
    router.push("/");
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="justify-center items-center border border-[color:var(--Color-Gray-50,#F9FAFB)] shadow-sm flex w-full max-w-[828px] flex-col py-12 rounded-lg border-solid">
        <div className="items-stretch self-center flex w-[367px] max-w-full gap-3 mt-1 px-5 py-9">
          <header className="text-neutral-900 text-3xl whitespace-nowrap">
            Welcome to
          </header>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/fad84bb1bb10d8cc468caba5945178e2d8abaf83567f17527647c040641eff01?apiKey=011554aff43544e6af46800a427fd184&"
            className="aspect-[6.81] object-contain object-center w-full overflow-hidden shrink-0 flex-1 my-auto"
          />
        </div>
        <div className="text-neutral-500 text-center text-lg leading-7 max-w-[257px] self-center mt-6">
          Collaborative Decarbonization
        </div>
        <header className="bg-gray-200 self-center w-[425px] shrink-0 max-w-full h-px mt-6" />

        {socialParam !== "true" ? (
          <form
            onSubmit={loginForm.handleSubmit}
            className="justify-center items-center self-stretch flex w-full flex-col mt-6 mb-1 px-16 py-6 max-md:max-w-full max-md:px-5"
          >
            <div className="flex w-full max-w-[589px] flex-col max-md:max-w-full">
              <div>
                <label
                  className="self-stretch text-slate-700 text-base font-light leading-6 max-md:max-w-full"
                  htmlFor="emailInput"
                >
                  Work email*
                </label>
                <Input
                  id="emailInput"
                  name={"email"}
                  onChange={loginForm.handleChange}
                  className={cn(
                    "text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full",
                    loginForm.errors.email && "border border-red-500"
                  )}
                  placeholder="Enter your email"
                />
                <p className="text-red-500 text-xs mt-[0.63rem]">
                  {loginForm.errors.email}
                </p>
              </div>

              <div className="mt-6">
                <label
                  className="self-stretch text-slate-700 text-base font-light leading-6 max-md:max-w-full"
                  htmlFor="passwordInput"
                >
                  Password
                </label>
                <div
                  className={cn(
                    "bg-gray-50 flex rounded-md mt-3 w-full",
                    loginForm.errors.password && "border border-red-500"
                  )}
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="passwordInput"
                    className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center px-2 py-7 rounded-md max-md:max-w-full"
                    placeholder="Enter your password"
                    name={"password"}
                    onChange={loginForm.handleChange}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center cursor-pointer pr-2"
                  >
                    {showPassword ? (
                      <EyeOff size={16} color="#64748B" />
                    ) : (
                      <Eye size={16} color="#64748B" />
                    )}
                  </div>
                </div>
                <p className="text-red-500 text-xs mt-[0.63rem]">
                  {loginForm.errors.password}
                </p>
              </div>
              <Link
                href="/forgot-password"
                className="text-blue-700 text-sm font-bold leading-5 self-stretch mt-3 max-md:max-w-full"
              >
                Forgot Password?
              </Link>
              <div className="w-fit mx-auto flex items-center space-x-2">
                {isPending && (
                  <Loader2 size={30} className="text-slate-400 animate-spin" />
                )}
                <Button type="submit" disabled={isPending}>
                  Login
                </Button>
              </div>
              <Link
                href={"/login?social=true"}
                className="text-blue-700 text-sm font-bold leading-5 self-center whitespace-nowrap mt-9"
              >
                or login with SSO
              </Link>
              <div className="text-blue-700 text-center text-xs font-medium leading-5 self-stretch mt-6 max-md:max-w-full">
                Don&apos;t have an account?{" "}
                <Link
                  href={"/register"}
                  className="font-bold text-sm text-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </form>
        ) : (
          <div className="items-stretch bg-white flex max-w-[408px] flex-col px-16 py-12 rounded-lg">
            <div
              role="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
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
              onClick={() => signIn("azure-ad", { callbackUrl: "/" })}
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
              href={"/login"}
              className="text-blue-700 text-sm font-bold cursor-pointer leading-5 self-center whitespace-nowrap mt-6"
            >
              Sign in without SSO
            </Link>
            <div className="text-blue-700 text-center text-xs font-medium leading-5 self-stretch mt-6 max-md:max-w-full">
              Don&apos;t have an account?{" "}
              <Link
                href={"/register"}
                className="font-bold text-sm text-blue-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
