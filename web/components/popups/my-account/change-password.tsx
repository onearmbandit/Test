"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccountStore } from "@/lib/stores/organisation.store";
import React from "react";

const ChangePassword = () => {
  const { setMyAccSection } = useAccountStore();
  return (
    <form
      action={() => setMyAccSection("home")}
      className="items-start w-full bg-white flex grow rounded-e-lg flex-col p-6 max-md:px-5"
    >
      <header className="text-blue-600 text-xs font-medium leading-5 self-stretch max-md:max-w-full">
        <span className="text-slate-500">Account &gt; My Account &gt; </span>
        <span className="text-blue-600">Change Password</span>
      </header>
      <h1 className="text-slate-700 text-lg font-bold leading-7 self-stretch mt-6 max-md:max-w-full">
        Change Password
      </h1>
      <hr className="bg-gray-300 self-stretch shrink-0 h-px mt-2 max-md:max-w-full" />

      <div className="w-full space-y-6">
        <div className="space-y-3 mt-4">
          <label className="text-slate-700 text-base font-semibold leading-6 self-stretch max-md:max-w-full">
            Enter your old password
          </label>
          <Input
            type="password"
            className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
            placeholder="Old password"
          />
        </div>
        <div className="space-y-3">
          <label className="text-slate-700 text-base font-semibold leading-6 self-stretch max-md:max-w-full">
            Enter your new password
          </label>
          <Input
            type="password"
            className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
            placeholder="New password"
          />
        </div>
        <div className="space-y-3">
          <label className="text-slate-700 text-base font-semibold leading-6 self-stretch max-md:max-w-full">
            Re enter your new password
          </label>
          <Input
            type="password"
            className="py-2 h-11 rounded-md bg-gray-50 text-xs leading-4 font-light text-slate-700"
            placeholder="New password"
          />
        </div>
        <div>
          <p className="text-xs text-slate-700 w-[82%]">
            Requirements: One lowercase character, one number, one uppercase
            character, 8 characters minimum, one special character
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            className="text-white text-center text-sm font-bold leading-4 whitespace-nowrap"
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
