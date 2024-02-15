"use client";
import Tick from "@/components/icons/Tick";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/services/auth.api";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ParsedUrlQuery } from "querystring";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const Page = ({ params }: { params: ParsedUrlQuery | undefined }) => {
  const router = useRouter();
  let token: any = "";
  let email: any = "";
  if (params) {
    token = params.token;
    email = params.email;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validation = z
    .object({
      newPassword: z.string(),
      confirmPassword: z.string(),
    })
    .superRefine((val, ctx) => {
      if (val.confirmPassword != val.newPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Confirm password not matching",
          path: ["confirmPassword"],
        });
      }
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
    mutationKey: ["reset-password", email, token],
    mutationFn: resetPassword,
    onSuccess: (res) => {
      toast.success("Password reset successfully", {
        style: { color: "green" },
      });
      router.push("/");
      // setCurrentStep(2);
    },
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const resetPasswordForm = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      email: email,
      token: token,
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: async (data) => {
      data.email = decodeURIComponent(email);
      data.token = token;

      mutate(data);
    },
  });

  return (
    <div className="h-screen grid place-items-center">
      <form
        onSubmit={resetPasswordForm.handleSubmit}
        className="justify-center items-center border w-full border-[#E5E7EB] shadow-sm flex max-w-[828px] flex-col py-4 rounded-lg border-solid"
      >
        <img
          loading="lazy"
          src={"/assets/images/Logo.png"}
          className="aspect-[0.95] object-contain object-center w-[177px] fill-[linear-gradient(180deg,#39775F_81.94%,#3A9B8C_105.47%)] overflow-hidden self-center max-w-full"
          alt="Logo"
        />
        <header className="header text-neutral-500 text-center text-3xl font-semibold leading-9 self-center whitespace-nowrap mt-6">
          Reset Password
        </header>
        <hr className="bg-gray-200 self-center w-[425px] shrink-0 max-w-full h-px mt-6" />
        <div className="form-body justify-center items-center self-stretch flex w-full flex-col mt-6 mb-7 px-16 py-7 max-md:max-w-full max-md:px-5">
          <div className="form-group flex w-full max-w-[589px] flex-col max-md:max-w-full">
            <label
              htmlFor="newPassword"
              className="form-label self-stretch text-slate-700 text-base font-light leading-6 max-md:max-w-full"
            >
              New password
            </label>
            <div className="form-control-group items-stretch bg-gray-50 self-stretch flex justify-between gap-2 mt-3 px-2  rounded-md max-md:max-w-full max-md:flex-wrap">
              <Input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name={"newPassword"}
                onChange={(e) => {
                  resetPasswordForm.handleChange(e);
                  const value = e.target.value;
                  const values = { password: value };

                  const result = passwordValidation.safeParse(values);

                  if (!result.success) {
                    setErrors(result.error.format()._errors);
                  } else {
                    setErrors([]);
                  }
                }}
                className="form-control-text text-slate-700 text-sm font-light leading-4 py-7 bg-gray-50 grow max-md:max-w-full"
              />
              {showPassword ? (
                <EyeOff
                  size={16}
                  className="text-slate-400 self-center cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  size={16}
                  className="text-slate-400 self-center cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>
          <div className="form-group flex w-full max-w-[589px] flex-col max-md:max-w-full">
            <label
              htmlFor="confirmPassword"
              className="form-label self-stretch text-slate-700 text-base font-light leading-6 mt-6 max-md:max-w-full"
            >
              Confirm password
            </label>
            <div
              className={cn(
                "form-control-group items-stretch bg-gray-50 self-stretch flex justify-between gap-2 mt-3 px-2 rounded-md max-md:max-w-full max-md:flex-wrap",
                resetPasswordForm.errors?.confirmPassword &&
                  "border border-red-500"
              )}
            >
              <Input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                name={"confirmPassword"}
                onChange={resetPasswordForm.handleChange}
                className="form-control-text text-slate-700 text-sm font-light leading-4 py-7 bg-gray-50 grow max-md:max-w-full"
              />
              {showConfirm ? (
                <EyeOff
                  size={16}
                  className="text-slate-400 self-center cursor-pointer"
                  onClick={() => setConfirm(false)}
                />
              ) : (
                <Eye
                  size={16}
                  className="text-slate-400 self-center cursor-pointer"
                  onClick={() => setConfirm(true)}
                />
              )}
            </div>
            <p className="text-xs text-red-500 mt-0.5">
              {resetPasswordForm.errors?.confirmPassword}
            </p>
          </div>

          <div className="input-group items-stretch w-full max-w-[589px] flex justify-between gap-5 mt-10 max-md:flex-wrap">
            <div className="input-help items-stretch flex grow basis-[0%] flex-col">
              <div className="input-help-item items-stretch flex justify-between gap-2">
                <Tick
                  variant={
                    resetPasswordForm.values.newPassword != ""
                      ? // ? resetPasswordForm.errors.password?.includes("lowercase")
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
                    resetPasswordForm.values.newPassword != ""
                      ? // ? resetPasswordForm.errors.password?.includes("uppercase")
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
                    resetPasswordForm.values.newPassword != ""
                      ? resetPasswordForm.values.newPassword.length < 8
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
                    resetPasswordForm.values.newPassword != ""
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
                    resetPasswordForm.values.newPassword != ""
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
          <Button
            type="submit"
            className="btn-reset-password text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center mt-9 px-4 py-3"
          >
            Reset password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
