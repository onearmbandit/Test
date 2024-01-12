import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";

function page() {
  return (
    <div className="h-screen grid place-items-center">
      <form className="justify-center items-center border border-[#E5E7EB] w-full shadow-sm flex max-w-[828px] flex-col py-12 rounded-lg border-solid">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c31c226fc0c71362158bd2a54e4d2b381d4680c739e010c167fd3d08f46c8af?apiKey=011554aff43544e6af46800a427fd184&"
          className="aspect-[0.95] object-contain object-center w-[107px] fill-[linear-gradient(180deg,#39775F_81.94%,#3A9B8C_105.47%)] overflow-hidden self-center max-w-full mt-16 max-md:mt-10"
          alt="Password Reset Logo"
        />

        <header className="text-neutral-900 text-3xl self-center whitespace-nowrap mt-14 max-md:mt-10">
          Forgot your password?
        </header>

        <div className="self-center text-neutral-500 text-center text-xs font-light leading-4 max-w-[346px] mt-14 max-md:mt-10">
          Just enter the email address associated with your account below, and
          we'll send you a link to reset your password.
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
              className="text-slate-500 text-xs font-light leading-4 items-stretch bg-gray-50 self-stretch justify-center mt-3 px-2 py-7 rounded-md max-md:max-w-full"
              placeholder="Enter your email"
              aria-label="Email"
            />

            <Button
              className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch mt-9 px-4 py-3"
              type="submit"
            >
              Send reset link
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default page;
