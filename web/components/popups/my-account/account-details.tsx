"use client";
import { Input } from "@/components/ui/input";
import { useAccountStore } from "@/lib/stores/organisation.store";
import { ChevronRight } from "lucide-react";
import React from "react";

const AccountDetails = () => {
  const { setMyAccSection } = useAccountStore();
  return (
    <form className="justify-center items-start bg-white grow rounded-e-lg flex flex-col p-6 max-md:px-5">
      <header className="text-gray-700 border-b border-gray-300 pb-3 text-lg font-bold leading-7 self-stretch max-md:max-w-full">
        My account
      </header>

      <section className="text-gray-700 text-xs font-medium leading-4 space-y-2.5 mt-6">
        <label>Name</label>
        <Input
          disabled={true}
          className="text-slate-700 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-100 
    justify-center p-2 rounded-md self-start"
          value="John Smith"
        />
      </section>
      <header className="text-gray-700 text-base font-semibold leading-6 self-stretch mt-9 max-md:max-w-full max-md:mt-10 pb-3 border-b border-gray-300">
        Account Security
      </header>

      <section className="text-black text-sm leading-5 self-stretch space-y-2.5 mt-2.5 max-md:max-w-full">
        <label>Email</label>
        <Input
          value={"johnsmith@pepsico.com"}
          className="text-gray-500 text-xs leading-4 self-stretch px-0 max-md:max-w-full"
        />
      </section>

      <section className="text-black space-y-2.5 text-sm leading-5 self-stretch mt-5 max-md:max-w-full">
        <label>Password</label>
        <div className="justify-between items-stretch self-stretch flex gap-5 py-2 max-md:max-w-full max-md:flex-wrap">
          <Input
            type="password"
            disabled
            value={"pass@123"}
            className="text-gray-500 text-xs leading-4 px-0"
          />
          <button
            type="button"
            onClick={() => setMyAccSection("changePass")}
            className="text-blue-600 whitespace-nowrap text-center text-sm font-semibold leading-4"
          >
            Update password
          </button>
        </div>
      </section>

      <header className="text-gray-700 text-base font-semibold leading-6 self-stretch mt-9 max-md:max-w-full border-b border-gray-300 pb-3">
        Support
      </header>

      <section className="text-red-500 text-sm leading-5 self-stretch mt-2.5 max-md:max-w-full">
        Delete my account
      </section>
      <div className="justify-between items-stretch content-center gap-y-2.5 self-stretch flex-wrap flex gap-5 mt-2.5 max-md:max-w-full">
        <div className="text-gray-500 text-xs leading-4">
          Permanently delete the account
        </div>
        <a href="#" aria-label="Delete Account" role="button">
          <ChevronRight size={16} className="text-slate-400" />
        </a>
      </div>
    </form>
  );
};

export default AccountDetails;
