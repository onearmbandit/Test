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

const FacilityTable = () => {
  return (
    <div className="bg-white rounded-lg w-full">
      <div className="bg-gray-100 px-4 py-3 flex justify-between items-center rounded-t-lg">
        <h3 className="text-slate-800 text-xs font-bold">Facilities</h3>
        <Button
          type="button"
          className="justify-between items-center text-black rounded border border-gray-200 hover:bg-black/10 bg-white flex gap-1.5 px-3.5 py-1.5 border-solid"
        >
          <Plus size={16} className="" />
          <span className="text-gray-800 text-sm font-semibold leading-5 grow whitespace-nowrap">
            Add Facility
          </span>
        </Button>
      </div>
      <Table>
        <TableHeader className="">
          <TableRow className="hover:bg-white">
            <TableHead>Facility Name</TableHead>
            <TableHead>Scope 1</TableHead>
            <TableHead>Scope 2</TableHead>
            <TableHead>Scope 3</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              11{" "}
              <Button
                size={"sm"}
                className="bg-white shadow-md hover:bg-black/10 gap-2 text-gray-500 text-xs font-semibold p-[0.44rem] uppercase"
                type="button"
              >
                <ArrowUpRight size={16} />
                view
              </Button>
            </TableCell>
            <TableCell>11</TableCell>
            <TableCell>11</TableCell>
            <TableCell>11</TableCell>
            <TableCell>11</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default FacilityTable;
