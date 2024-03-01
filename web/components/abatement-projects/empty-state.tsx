"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const EmptyState = ({ link }: { link: string }) => {
  const pathname = usePathname();
  const splitPath = pathname.split("/");
  const currentAbatement = splitPath[splitPath.length - 1];
  return (
    <div className="bg-white px-6 py-16 rounded-lg grid place-items-center border border-slate-100">
      <div className="flex flex-col items-center space-y-3">
        {currentAbatement === "proposed" && (
          <Image
            width={46}
            height={46}
            src={"/assets/images/folder-add.svg"}
            alt="folder-icon"
          />
        )}
        {currentAbatement === "active" && (
          <Image
            width={46}
            height={46}
            src={"/assets/images/folder-open.svg"}
            alt="folder-icon"
          />
        )}
        {currentAbatement === "completed" && (
          <Image
            width={46}
            height={46}
            src={"/assets/images/folder-closed.svg"}
            alt="folder-icon"
          />
        )}

        <p className="text-center text-slate-700 font-semibold text-3xl ">
          <span className="capitalize">{currentAbatement}</span> Abatement
          Projects
        </p>
        <p className="text-center text-slate-700 font-light text-lg p-3 pb-5">
          There are currently no {currentAbatement} abatement projects.
        </p>

        {/* {currentAbatement != "completed" && ( */}
        <Link href={link}>
          <Button type="button" className="flex gap-1">
            + Propose a Project
          </Button>
        </Link>
        {/* )} */}
      </div>
    </div>
  );
};

export default EmptyState;
