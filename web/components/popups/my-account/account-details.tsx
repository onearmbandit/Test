"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAccountStore } from "@/lib/stores/organisation.store";
import { getUser } from "@/services/organizations.api";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import React from "react";

const AccountDetails = () => {
  const { setMyAccSection } = useAccountStore();

  const { data, isLoading } = useQuery({
    queryKey: ["account-details"],
    queryFn: () => getUser(),
  });

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
          value={` ${data?.data?.first_name} ${data?.data?.last_name}`}
        />
      </section>
      <header className="text-gray-700 text-base font-semibold leading-6 self-stretch mt-9 max-md:max-w-full max-md:mt-10 pb-3 border-b border-gray-300">
        Account Security
      </header>

      <section className="text-black text-sm leading-5 self-stretch space-y-2.5 mt-2.5 max-md:max-w-full">
        <label>Email</label>
        <Input
          disabled
          value={`${data?.data?.email}`}
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
      <Dialog>
        <DialogTrigger className="w-full">
          <div
            role="button"
            className="justify-between items-stretch content-center gap-y-2.5 self-stretch flex-wrap flex gap-5 mt-2.5 max-md:max-w-full"
          >
            <div className="text-gray-500 text-xs leading-4">
              Permanently delete the account
            </div>
            <p>
              <ChevronRight size={16} className="text-slate-400" />
            </p>
          </div>
        </DialogTrigger>
        <DialogContent className="space-y-6">
          <h1 className="text-gray-700 text-base leading-6">
            This action cannot be undone. This will permanently delete your
            entire account. Please type in your email and password to confirm.
          </h1>
          <section className="input-container w-full">
            <Input
              type="email"
              placeholder="johnsmith@pepsico.com"
              className="text-gray-500 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-50 justify-center px-2 py-3.5 rounded-md"
            />
          </section>
          <section className="input-container w-full">
            <Input
              type="password"
              id="password"
              className="text-gray-500 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-50 justify-center px-2 py-3.5 rounded-md"
              value={"Pass@123"}
            />
          </section>
          <Button
            type="button"
            variant={"outline"}
            className="border-2 border-red-500 font-semibold text-red-500 hover:bg-red-50 hover:text-red-500"
          >
            Permanently delete account
          </Button>
          <DialogClose>
            <Button
              type="button"
              variant={"outline"}
              className="w-full border-2 border-gray-300 text-gray-500 hover:text-gray-600"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default AccountDetails;
