"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Loader2, Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  editProductLines,
  getEqualityData,
  getProductLines,
} from "@/services/facility.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/lib/types/product.type";
import _ from "lodash";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const ProductLineEmissions = ({ period }: { period: string }) => {
  const queryClient = useQueryClient();
  const [emissions, setEmissions] = useState<Product[]>([
    {
      scope1CarbonEmission: "",
      scope2CarbonEmission: "",
      scope3CarbonEmission: "",
      equalityAttribute: "",
    },
  ]);
  const [equallyModal, setEquallyModal] = useState(false);
  const [isEqual, setIsEqual] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const prodLines = useQuery({
    queryKey: ["product-emissions", period],
    queryFn: () => getProductLines(period!),
  });
  const productLines = prodLines.isSuccess ? prodLines.data : [];

  const equality = useQuery({
    queryKey: ["equality", period],
    queryFn: () => getEqualityData(period!),
    enabled: false,
  });
  const equalEmission = equality.isSuccess ? equality.data : {};

  const { mutate } = useMutation({
    mutationFn: editProductLines,
    onSuccess: (data) => {
      toast.success("Products Lines updated.", { style: { color: "green" } });
      queryClient.invalidateQueries({
        queryKey: ["product-emissions", period, "facility-details"],
      });
      setEdit(false);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const handleSubmit = () => {
    const editKeys = [
      "scope1CarbonEmission",
      "id",
      "scope2CarbonEmission",
      "scope3CarbonEmission",
      "equalityAttribute",
    ];
    const emissionCopy = _.cloneDeep(emissions);
    emissionCopy.map((em) => {
      Object.keys(em).map((item) => {
        if (!editKeys.includes(item)) {
          delete em[item];
        }
      });
      return em;
    });
    const formData = {
      facilityEmissionId: period,
      facilityProducts: emissionCopy,
    };
    mutate(formData);
  };

  const handleEqual = async () => {
    const editKeys = [
      "scope1CarbonEmission",
      "id",
      "scope2CarbonEmission",
      "scope3CarbonEmission",
      "equalityAttribute",
    ];

    await queryClient.prefetchQuery({
      queryKey: ["equality", period],
      queryFn: () => getEqualityData(period),
    });
  };

  useEffect(() => {
    if (prodLines.isSuccess) {
      setEmissions(productLines.data);
    }
  }, [prodLines.status]);

  useEffect(() => {
    if (equality.isSuccess) {
      setEmissions(equalEmission.data);
      setIsEqual(true);
    }
  }, [equality.status]);

  return (
    <>
      <Accordion type="multiple" className="space-y-4">
        {prodLines.isLoading && (
          <Loader2 className="text-blue-400 animate-spin" />
        )}
        {prodLines.isSuccess &&
          emissions?.map((item: Product, i: number) => (
            <AccordionItem key={i} value={item.name!} className="border-0">
              <AccordionTrigger className="flex rounded-md [&[data-state=closed]>svg#minus]:hidden [&[data-state=open]>svg#plus]:hidden bg-gray-100 px-4 py-2">
                <p className="text-xs font-bold">{item.name}</p>
                <Minus size={16} id="minus" />
                <Plus size={16} id="plus" />
              </AccordionTrigger>
              <AccordionContent className="py-3">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b hover:bg-transparent py-2">
                      <TableHead className="text-xs py-2 h-fit">
                        Quantity
                      </TableHead>
                      <TableHead className="text-xs py-2 h-fit">
                        Scope 1
                      </TableHead>
                      <TableHead className="text-xs py-2 h-fit">
                        Scope 2
                      </TableHead>
                      <TableHead className="text-xs py-2 h-fit">
                        Scope 3
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="pt-3">
                    <TableRow className="hover:bg-transparent justify-evenly text-xs">
                      <TableCell className="w-1/4">{item.quantity}</TableCell>
                      <TableCell>
                        <Input
                          type={isEqual ? "text" : "number"}
                          disabled={!isEdit}
                          value={item.scope1_carbon_emission!}
                          className="bg-gray-50 w-1/2"
                          onChange={(e) => {
                            const copy = _.cloneDeep(emissions);
                            copy[i].scope1CarbonEmission = e.target.value;
                            copy[i].scope1_carbon_emission = e.target.value;
                            setEmissions(copy);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type={isEqual ? "text" : "number"}
                          disabled={!isEdit}
                          value={item.scope2_carbon_emission!}
                          onChange={(e) => {
                            const copy = _.cloneDeep(emissions);
                            copy[i].scope2CarbonEmission = e.target.value;
                            copy[i].scope2_carbon_emission = e.target.value;
                            setEmissions(copy);
                          }}
                          className="bg-gray-50 w-1/2"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type={isEqual ? "text" : "number"}
                          disabled={!isEdit}
                          value={item.scope3_carbon_emission!}
                          onChange={(e) => {
                            const copy = _.cloneDeep(emissions);
                            copy[i].scope3CarbonEmission = e.target.value;
                            copy[i].scope3_carbon_emission = e.target.value;
                            setEmissions(copy);
                          }}
                          className="bg-gray-50 w-1/2"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
      <div className="flex justify-end p-[10px]">
        <p className="text-xs font-bold text-slate-600">tCO2e/func. unit</p>
      </div>
      {isEdit ? (
        <>
          <div className="flex justify-start gap-2 mt-3 p-[10px]">
            <Input
              id="equalDistribution"
              type="checkbox"
              checked={isEqual}
              className="w-fit"
              onChange={(e) => {
                if (!isEqual) {
                  setEquallyModal(true);
                } else {
                  setIsEqual(false);
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
          <div className="flex justify-end">
            <Button
              size={"sm"}
              onClick={() => handleSubmit()}
              className="px-4 py-1"
            >
              Save
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-end">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => setEdit(true)}
            className="text-blue-600 hover:text-blue-600"
          >
            Edit
          </Button>
        </div>
      )}
      <Dialog open={equallyModal} onOpenChange={setEquallyModal}>
        <DialogContent className="space-y-6">
          <p className="text-slate-700">
            Are you sure you want to equally attribute emissions across product?
            It will erase your current entry.
          </p>
          <DialogClose asChild>
            <Button
              variant={"outline"}
              className="border-2 text-blue-600 hover:text-blue-600 border-blue-600 w-full"
            >
              No, don&apos;t erase my entry
            </Button>
          </DialogClose>
          <DialogClose>
            <Button
              variant={"outline"}
              onClick={() => handleEqual()}
              className="border-2 border-gray-500 text-gray-500 w-full"
            >
              Yes, continue
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductLineEmissions;
