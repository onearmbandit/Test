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
import { deleteUser, getUser, updateUser } from "@/services/user.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const AccountDetails = () => {
  const { setMyAccSection } = useAccountStore();
  const queryClient = useQueryClient();

  const deleteValidation = z.object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  });

  const {
    data: user,
    isLoading,
    status,
  } = useQuery({
    queryKey: ["account-details"],
    queryFn: () => getUser(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      signOut();
      toast.success("Account Deleted.", { style: { color: "green" } });
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const deleteAccount = useFormik({
    initialValues: {
      password: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: toFormikValidationSchema(deleteValidation),
    onSubmit: (data) => {
      mutate({ obj: { ...data, email: user?.data?.email } });
    },
  });

  const { mutate: changeName, isPending: changeNamePending } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // if(data)
      queryClient.invalidateQueries({ queryKey: ["account-details"] });
      toast.success("Profile Updated", { style: { color: "green" } });
    },
    onError: (error) => {
      toast.error(error.message, { style: { color: "red" } });
    },
  });

  const changeNameForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    onSubmit: (data) => {
      console.log(data);
      changeName({ formBody: data });
    },
  });

  const disableSaveBtn = () => {
    if (
      user?.data?.first_name === changeNameForm.values.firstName &&
      user?.data?.last_name === changeNameForm.values.lastName
    ) {
      return true;
    }

    return false;
  };
  useEffect(() => {
    if (status == "success") {
      changeNameForm.setFieldValue("firstName", user?.data?.first_name);
      changeNameForm.setFieldValue("lastName", user?.data?.last_name);
    }
  }, [status]);

  return (
    <div className="justify-center items-start bg-white grow rounded-e-lg flex flex-col p-6 max-md:px-5">
      <header className="text-gray-700 border-b border-gray-300 pb-3 text-lg font-bold leading-7 self-stretch max-md:max-w-full">
        My account
      </header>

      <form
        onSubmit={changeNameForm.handleSubmit}
        className="text-gray-700 text-xs font-medium w-full leading-4 mt-6"
      >
        <div className="flex space-x-3">
          <div className="space-y-2.5">
            <label>First Name</label>
            <Input
              name="firstName"
              onChange={changeNameForm.handleChange}
              className="text-slate-700 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-100 
            justify-center p-2 rounded-md self-start"
              value={changeNameForm.values.firstName}
            />
          </div>
          <div className="space-y-2.5">
            <label>Last Name</label>
            <Input
              name="lastName"
              onChange={changeNameForm.handleChange}
              className="text-slate-700 text-sm font-light leading-5 whitespace-nowrap items-stretch bg-gray-100 
            justify-center p-2 rounded-md self-start"
              value={changeNameForm.values.lastName}
            />
          </div>
        </div>

        <div className="flex w-full justify-end mt-2">
          <Button
            variant={"ghost"}
            disabled={disableSaveBtn() || changeNamePending}
            className="text-blue-600 hover:text-blue-500 font-semibold"
          >
            Save
          </Button>
        </div>
      </form>
      <header className="text-gray-700 text-base font-semibold leading-6 self-stretch mt-6 max-md:max-w-full pb-3 border-b border-gray-300">
        Account Security
      </header>

      <section className="text-black text-sm leading-5 self-stretch space-y-2.5 mt-2.5 max-md:max-w-full">
        <label>Email</label>
        <Input
          disabled
          value={`${user?.data?.email}`}
          className="text-gray-500 text-sm leading-4 self-stretch px-0 max-md:max-w-full"
        />
      </section>

      <section className="text-black space-y-2.5 text-sm leading-5 self-stretch mt-5 max-md:max-w-full">
        <label>Password</label>
        <div className="justify-between items-stretch self-stretch flex gap-5 py-2 max-md:max-w-full max-md:flex-wrap">
          <Input
            type="password"
            disabled
            value={"pass@123"}
            className="text-gray-500 text-sm leading-4 px-0"
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
                disabled
                onChange={deleteAccount.handleChange}
                value={user?.data?.email}
                placeholder="johnsmith@pepsico.com"
                className={cn(
                  "text-gray-500 text-sm font-light leading-5 whitespace-nowrap disabled:text-link-btn placeholder:text-link-btn items-stretch bg-gray-50 justify-center px-2 py-3.5 rounded-md"
                )}
              />
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
