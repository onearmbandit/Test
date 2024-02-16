"use client";

import React from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getFacilities } from "@/services/facility.api";
import { useRouter } from "next/navigation";

const FacilityTable = () => {
  const router = useRouter();
  const {
    data: facilities,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: () => getFacilities(),
  });

  return (
    <div className="bg-white rounded-lg w-full mt-7">
      <div className="bg-gray-100 px-4 py-3 flex justify-between items-center rounded-t-lg">
        <h3 className="text-slate-800 text-xs font-bold">Facilities</h3>
        <Link
          href={"/facilities?add-new=true"}
          className="justify-between items-center text-black rounded border border-gray-200 hover:bg-black/10 bg-white flex gap-1.5 px-3.5 py-1.5 border-solid"
        >
          <Plus size={16} className="" />
          <p className="text-gray-800 text-sm font-semibold leading-5 grow whitespace-nowrap">
            Add Facility
          </p>
        </Link>
      </div>
      <Table>
        <TableHeader className="">
          <TableRow className="hover:bg-white">
            <TableHead className="w-1/5">Facility Name</TableHead>
            <TableHead>Scope 1</TableHead>
            <TableHead>Scope 2</TableHead>
            <TableHead>Scope 3</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isSuccess &&
            facilities.data.map((item: any) => (
              <TableRow
                key={item.id}
                onClick={() =>
                  router.push(
                    `/facilities/${item.name.split(" ").join("-")}?facilityId=${
                      item.id
                    }`
                  )
                }
                className="group"
              >
                <TableCell className="flex h-10 justify-between items-center">
                  <p className="whitespace-nowrap">{item.name}</p>
                  <Button
                    size={"sm"}
                    className="bg-white hidden group-hover:flex shadow-md hover:bg-black/10 gap-2 text-gray-500 text-xs font-semibold p-[0.44rem] uppercase"
                    type="button"
                  >
                    <ArrowUpRight size={16} />
                    view
                  </Button>
                </TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
              </TableRow>
            ))}
          {facilities?.data?.length == 0 && (
            <TableRow
              onClick={() => router.push(`/facilities?add-new=true`)}
              className="group cursor-pointer"
            >
              <TableCell className="h-10">+ New Facility</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FacilityTable;
