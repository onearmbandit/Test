"use client";
import React, { useState } from "react";
import AccountsNav from "../organisation/sidebar";
import OrganisationPage from "./organisation-page";
import MyAccountPage from "./my-account";
import { useAccountStore } from "@/lib/stores/organisation.store";

const Accounts = () => {
  const { navItem, setNav } = useAccountStore();
  const navItems: { [key: string]: () => JSX.Element } = {
    organisation: OrganisationPage,
    myAccount: MyAccountPage,
  };
  const AccountPage = navItems[navItem];
  return (
    <div className="flex max-md:flex-col h-full">
      <AccountsNav />
      <div className="flex flex-col items-stretch h-full w-full max-md:w-full max-md:ml-0">
        <AccountPage />
      </div>
    </div>
  );
};

export default Accounts;
