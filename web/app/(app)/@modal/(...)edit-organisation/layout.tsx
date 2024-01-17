"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import AccountsNav from "@/components/popups/organisation/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.split("/")[1];
  return (
    <>
      <Dialog
        open={basePath == "edit-organisation"}
        onOpenChange={() => {
          router.push("/");
        }}
      >
        <DialogContent className="shadow w-full max-w-[857px] rounded-lg h-full max-h-[551px] p-0">
          <div className=" flex max-md:flex-col h-full">
            <AccountsNav />
            <div className="flex flex-col items-stretch h-full w-full max-md:w-full max-md:ml-0">
              {children}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Layout;
