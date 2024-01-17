"use client";
import Dashboard from "@/components/Dashboard";
import EditAddress from "@/components/popups/organisation/edit-address";
import EditClimateConditions from "@/components/popups/organisation/edit-climate-conditions";
import EditEmployees from "@/components/popups/organisation/edit-employees";
import EditNaics from "@/components/popups/organisation/edit-naics";
import OrganisationAccount from "@/components/popups/organisation/organisation-account";
import AccountsNav from "@/components/popups/organisation/sidebar";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Dashboard />
      <Dialog open={true}>
        <DialogOverlay className="bg-black/20 absolute inset-0" />
        <DialogContent className="absolute inset-0 grid place-items-center">
          <div className="shadow w-full max-w-[857px] rounded-lg h-full max-h-[551px]">
            <div className=" flex max-md:flex-col h-full">
              <AccountsNav />
              <div className="flex flex-col items-stretch h-full w-full max-md:w-full max-md:ml-0">
                {/* <OrganisationAccount /> */}
                {/* <EditAddress /> */}
                {/* <EditEmployees /> */}
                {/* <EditNaics /> */}
                <EditClimateConditions />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
