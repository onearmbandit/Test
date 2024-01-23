"use client";
import React, { useState } from "react";
import OrganisationAccount from "../organisation/organisation-account";
import EditAddress from "../organisation/edit-address";
import EditEmployees from "../organisation/edit-employees";
import EditNaics from "../organisation/edit-naics";
import EditClimateConditions from "../organisation/edit-climate-conditions";
import { useAccountStore } from "@/lib/stores/organisation.store";

const OrganisationPage = () => {
  const { orgSection: selectedSection, setOrgSection } = useAccountStore();
  const sections: {
    [key: string]: ({
      section,
    }: {
      section: string;
      setSection: (val: string) => void;
    }) => JSX.Element;
  } = {
    home: OrganisationAccount,
    address: EditAddress,
    employees: EditEmployees,
    naics: EditNaics,
    climate: EditClimateConditions,
  };
  const CurrentSection = sections[selectedSection];
  return (
    <>
      <CurrentSection section={selectedSection} setSection={setOrgSection} />
    </>
  );
};

export default OrganisationPage;
