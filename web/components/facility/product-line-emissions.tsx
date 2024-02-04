"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

const ProductLineEmissions = () => {
  const [equallyModal, setEquallyModal] = useState(false);
  return (
    <>
      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="i" className="border-0">
          <AccordionTrigger className="flex rounded-md [&[data-state=closed]>svg#minus]:hidden [&[data-state=open]>svg#plus]:hidden bg-gray-100 px-4 py-2">
            <p className="text-xs font-bold">Prodcut 1 </p>
            <Minus size={16} id="minus" />
            <Plus size={16} id="plus" />
          </AccordionTrigger>
          <AccordionContent className="py-3">
            <ProductLineTable />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2" className="border-0">
          <AccordionTrigger className="flex rounded-md [&[data-state=closed]>svg#minus]:hidden [&[data-state=open]>svg#plus]:hidden bg-gray-100 px-4 py-2">
            <p className="text-xs font-bold">Prodcut 1 </p>
            <Minus size={16} id="minus" />
            <Plus size={16} id="plus" />
          </AccordionTrigger>
          <AccordionContent className="py-3">
            <ProductLineTable />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end p-[10px]">
        <p className="text-xs font-bold text-slate-600">tCO2e/func. unit</p>
      </div>
      <div className="flex justify-start gap-2 mt-3 p-[10px]">
        <Input
          id="equalDistribution"
          type="checkbox"
          className="w-fit"
          onChange={(e) => {
            if (e.target.checked) {
              setEquallyModal(true);
            }
          }}
        />{" "}
        <label
          htmlFor="equalDistribution"
          className="text-slate-600 text-xs whitespace-nowrap"
        >
          Equally attribute emissions across products
        </label>
      </div>
      <Dialog open={equallyModal} onOpenChange={setEquallyModal}>
        <DialogContent className="space-y-6">
          <p className="text-slate-700">
            Are you sure you want to equally attribute emissions across product?
            It will erase your current entry.
          </p>
          <Button
            variant={"outline"}
            className="border-2 text-blue-600 hover:text-blue-600 border-blue-600 w-full"
          >
            No, don&apos;t erase my entry
          </Button>
          <Button
            variant={"outline"}
            className="border-2 border-gray-500 text-gray-500 w-full"
          >
            Yes, continue
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ProductLineTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b hover:bg-transparent py-2">
          <TableHead className="text-xs py-2 h-fit">Quantity</TableHead>
          <TableHead className="text-xs py-2 h-fit">Scope 1</TableHead>
          <TableHead className="text-xs py-2 h-fit">Scope 2</TableHead>
          <TableHead className="text-xs py-2 h-fit">Scope 3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="pt-3">
        <TableRow className="hover:bg-transparent justify-evenly text-xs">
          <TableCell className="w-1/4">1000</TableCell>
          <TableCell>
            <Input className="bg-gray-50 w-1/2" />
          </TableCell>
          <TableCell>
            <Input className="bg-gray-50 w-1/2" />
          </TableCell>
          <TableCell>
            <Input className="bg-gray-50 w-1/2" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ProductLineEmissions;
