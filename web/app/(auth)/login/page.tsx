"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";

function page() {
  const router = useRouter();
  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={() => {
          localStorage.setItem("token", "true");
          router.push("/");
        }}
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
              type="email"
              id="emailInput"
              className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full"
              placeholder="Enter your email"
              aria-label="Enter your email"
              aria-required="true"
            />
            <label
              className="self-stretch text-slate-700 text-base font-light leading-6 mt-6 max-md:max-w-full"
              htmlFor="passwordInput"
            >
              Password
            </label>
            <Input
              type="password"
              id="passwordInput"
              className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full"
              placeholder="Enter your password"
              aria-label="Enter your password"
              aria-required="true"
            />
            <a
              href="#"
              className="text-blue-700 text-sm font-bold leading-5 self-stretch mt-3 max-md:max-w-full"
            >
              Forgot Password?
            </a>
            <Button type="submit" className="w-fit mx-auto">
              Login
            </Button>
            <div className="text-blue-700 text-sm font-bold leading-5 self-center whitespace-nowrap mt-9">
              or login with SSO
            </div>
            <div className="text-blue-700 text-center text-xs font-medium leading-5 self-stretch mt-6 max-md:max-w-full">
              Don’t have an account?{" "}
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
}

export default page;
