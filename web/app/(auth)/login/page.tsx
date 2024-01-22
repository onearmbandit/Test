"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const validation = z.object({
    email: z.string().email(),
    password: z.string(),
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
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data) => {
      mutate(data);
    },
  });
  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={loginForm.handleSubmit}
        className="justify-center items-center border border-[color:var(--Color-Gray-50,#F9FAFB)] shadow-sm flex w-full max-w-[828px] flex-col py-12 rounded-lg border-solid"
      >
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
        <div className="justify-center items-center self-stretch flex w-full flex-col mt-6 mb-1 px-16 py-6 max-md:max-w-full max-md:px-5">
          <div className="flex w-full max-w-[589px] flex-col max-md:max-w-full">
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
              className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full"
              placeholder="Enter your email"
            />

            <label
              className="self-stretch text-slate-700 text-base font-light leading-6 mt-6 max-md:max-w-full"
              htmlFor="passwordInput"
            >
              Password
            </label>
            <div className="bg-gray-50 flex rounded-md mt-3 w-full">
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
            <a
              href="#"
              className="text-blue-700 text-sm font-bold leading-5 self-stretch mt-3 max-md:max-w-full"
            >
              Forgot Password?
            </a>
            <div className="w-fit mx-auto flex items-center space-x-2">
              {isPending && (
                <Loader2 size={30} className="text-slate-400 animate-spin" />
              )}
              <Button type="submit" disabled={isPending}>
                Login
              </Button>
            </div>
            <div className="text-blue-700 text-sm font-bold leading-5 self-center whitespace-nowrap mt-9">
              or login with SSO
            </div>
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
        </div>
      </form>
    </div>
  );
};

export default Page;
