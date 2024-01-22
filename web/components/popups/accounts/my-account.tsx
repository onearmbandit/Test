"use client";
import { useAccountStore } from "@/lib/stores/organisation.store";
import React from "react";
import AccountDetails from "../my-account/account-details";
import ChangePassword from "../my-account/change-password";

const MyAccountPage = () => {
  const { myAccSection: section, setMyAccSection } = useAccountStore();
  const sections: { [key: string]: () => JSX.Element } = {
    home: AccountDetails,
    changePass: ChangePassword,
  };
  const AccountSection = sections[section];

  return (
    <>
      <AccountSection />
    </>
  );
};

export default MyAccountPage;
