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
import { cn } from "@/lib/utils";
import { deleteUser, getUser } from "@/services/user.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const AccountDetails = () => {
  const { setMyAccSection } = useAccountStore();

  const deleteValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["account-details"],
    queryFn: () => getUser(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      signOut();
      toast.success("Account Deleted.", { style: { color: "green" } });
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const deleteAccount = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: toFormikValidationSchema(deleteValidation),
    onSubmit: (data) => {
      mutate({ obj: data });
    },
  });

  console.log(deleteAccount.errors);

  return (
    <div className="justify-center items-start bg-white grow rounded-e-lg flex flex-col p-6 max-md:px-5">
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
        <DialogContent>
          <form onSubmit={deleteAccount.handleSubmit} className="space-y-6">
            <h1 className="text-gray-700 text-base leading-6 pb-6">
              This action cannot be undone. This will permanently delete your
              entire account. Please type in your email and password to confirm.
            </h1>
            <section className="input-container w-full">
              <Input
                name="email"
                onChange={deleteAccount.handleChange}
                placeholder="johnsmith@pepsico.com"
                className={cn(
                  "text-gray-500 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-50 justify-center px-2 py-3.5 rounded-md",
                  deleteAccount.errors?.email && "border border-red-500"
                )}
              />
              <p className="text-xs text-red-500 py-[10px]">
                {deleteAccount.errors?.email}
              </p>
            </section>
            <section className="input-container w-full">
              <Input
                type="password"
                id="password"
                name="password"
                onChange={deleteAccount.handleChange}
                className={cn(
                  "text-gray-500 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-50 justify-center px-2 py-3.5 rounded-md",
                  deleteAccount.errors?.password && "border border-red-500"
                )}
                placeholder={"Pass@123"}
              />
              <p className="text-xs text-red-500 py-[10px]">
                {deleteAccount.errors?.password}
              </p>
            </section>
            <Button
              type="submit"
              variant={"outline"}
              className="border-2 w-full border-red-500 font-semibold text-red-500 hover:bg-red-50 hover:text-red-500"
            >
              Permanently delete account
            </Button>
            <DialogClose className="block w-full">
              <Button
                type="button"
                variant={"outline"}
                className="w-full border-2 border-gray-300 text-gray-500 hover:text-gray-600"
              >
                Cancel
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountDetails;
