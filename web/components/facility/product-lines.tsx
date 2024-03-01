"use client";

import React, { SetStateAction, Suspense, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { HelpCircle, Loader2, X } from "lucide-react";
import { Product } from "@/lib/types/product.type";
import { Button } from "../ui/button";
import _ from "lodash";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProductLines,
  editProductLines,
  getAllFacilityProductNames,
  getProductLines,
} from "@/services/facility.api";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import CreatableSelect from "react-select/creatable";
import { useSession } from "next-auth/react";
import { getUser } from "@/services/user.api";

const ProductLines = ({
  period,
  completeStatus,
  setStatus,
}: {
  period: string;
  completeStatus: { 1: boolean; 2: boolean; 3: boolean };
  setStatus: React.Dispatch<
    SetStateAction<{ 1: boolean; 2: boolean; 3: boolean }>
  >;
}) => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");
  const [isEdit, setEdit] = useState(false);
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([
    { name: "", quantity: 0, functionalUnit: "" },
  ]);

  const userQ = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data.data : {};

  return (
    <>
      {isEdit ? (
        <Suspense fallback={<Loader2 className="animate-spin text-blue-400" />}>
          <EditProducts period={period} setEdit={setEdit} user={user} />
        </Suspense>
      ) : (
        <Suspense fallback={<Loader2 className="animate-spin text-blue-400" />}>
          <Productlist
            period={period}
            setEdit={setEdit}
            complete={completeStatus}
            setStatus={setStatus}
          />
        </Suspense>
      )}
    </>
  );
};

const EditProducts = ({
  period,
  setEdit,
  user,
}: {
  period: string;
  user: any;
  setEdit: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");

  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([
    { name: "", quantity: 0, functionalUnit: "" },
  ]);

  const prodLines = useQuery({
    queryKey: ["product-lines", period],
    queryFn: () => getProductLines(period!),
  });
  const productLines = prodLines.isSuccess ? prodLines.data : [];
  const orgId =
    user?.organizations.length > 0 ? user?.organizations[0]?.id : null;

  const productNamesQ = useQuery({
    queryKey: ["product-names", orgId],
    queryFn: () => getAllFacilityProductNames(orgId),
    enabled: Object.keys(user).length > 0,
  });
  const productNames = productNamesQ.isSuccess ? productNamesQ.data?.data : [];
  const nameList: { value: string; label: string }[] = productNames?.map(
    (item: string) => ({
      label: item,
      value: item,
    })
  );

  const customDropdownStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: "none",
      background: "#F9FAFB",
      borderColor: "none",
      borderRadius: "6px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const { mutate, isPending: addPending } = useMutation({
    mutationFn: addProductLines,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      toast.success("Products Lines added.", { style: { color: "green" } });
      queryClient.invalidateQueries({
        queryKey: [
          "product-lines",
          period,
          "facility-details",
          "product-emissions",
        ],
        fetchStatus: "idle",
      });
      queryClient.invalidateQueries({
        queryKey: ["product-lines", period],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-emissions", period],
      });
      queryClient.invalidateQueries({
        queryKey: ["reporting-periods"],
      });
      queryClient.invalidateQueries({
        queryKey: ["productlines"],
      });
      setEdit(false);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const { mutate: editMutate, isPending: editPending } = useMutation({
    mutationFn: editProductLines,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      toast.success("Products Lines updated.", { style: { color: "green" } });
      queryClient.invalidateQueries({
        queryKey: ["product-lines", period],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-emissions", period],
      });
      queryClient.invalidateQueries({
        queryKey: ["reporting-periods"],
      });
      queryClient.invalidateQueries({
        queryKey: ["productlines"],
      });
      setEdit(false);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const handleAddProductLine = () => {
    const newProduct = { name: "", quantity: 0, functionalUnit: "" };
    const productLineClone = _.cloneDeep(products);
    productLineClone.push(newProduct);
    setProducts(productLineClone);
  };

  const handleProductRemove = (index: number) => {
    const productLineClone = _.cloneDeep(products);
    productLineClone.splice(index, 1);
    setProducts(productLineClone);
  };

  const handleSubmit = () => {
    const productKeys = ["id", "name", "quantity", "functionalUnit"];
    const copy = _.cloneDeep(products);
    copy.map((item) => {
      Object.keys(item).map((i) => {
        if (!productKeys.includes(i)) {
          delete item[i];
        }
      });

      return item;
    });
    const formData = {
      facilityEmissionId: period,
      facilityProducts: copy,
    };
    if (productLines.data?.FacilityProducts?.length == 0) {
      // console.log("add", formData);
      mutate({ ...formData, equalityAttribute: true });
    } else {
      // console.log("edit ", formData);
      editMutate(formData);
    }
  };

  useEffect(() => {
    if (prodLines.isSuccess) {
      const updated =
        productLines?.data?.FacilityProducts.length > 0
          ? productLines?.data?.FacilityProducts.map((item: Product) => ({
              ...item,
              functionalUnit: item?.functional_unit,
            }))
          : [{ name: "", quantity: 0, functionalUnit: "" }];
      // console.log(productLines?.data?.FacilityProducts.length);
      setProducts(updated);
      if (productLines?.data?.FacilityProducts.length == 0) {
        setEdit(true);
      }
    }
  }, [prodLines.status, prodLines.data]);

  return (
    <div className="flex flex-col items-stretch self-stretch text-xs leading-4 bg-white rounded-lg">
      <header className="grid grid-cols-3 gap-5   py-2 w-full font-bold border-b border-solid border-b-slate-200 text-slate-700 md:flex-wrap md:max-w-full">
        <div className="flex-auto">Product Name</div>
        <div className="flex-auto my-auto place-self-center">
          Quantity (unit)
        </div>
        <div className="flex gap-3 self-start pr-9 place-self-end">
          <div>Functional Unit</div>

          <TooltipProvider delayDuration={800}>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle size={16} className="text-white fill-slate-600" />
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 max-w-[246px] px-2.5 py-3 font-normal rounded shadow-sm">
                <p className=" text-xs leading-4 text-white">
                  A functional unit in sustainability is a measure of
                  performance that quantifies the environmental impacts of a
                  system, used to compare different products or processes within
                  a defined context.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {products.map((item: Product, i: number) => (
        <div
          key={i}
          className="gap-5 grid grid-cols-3 mt-6 w-full whitespace-nowrap text-slate-700"
        >
          <div className="max-w-[236px] w-full pl-1">
            <CreatableSelect
              options={nameList}
              onChange={(e) => {
                const copy = _.cloneDeep(products);
                copy[i].name = e?.label;
                setProducts(copy);
              }}
              styles={customDropdownStyles}
              placeholder={"Add product name"}
              onCreateOption={(e) => {
                const newOption = {
                  name: e,
                  quantity: "",
                  type: "",
                  functionalUnit: "",
                  scope_3Contribution: "",
                };
                const newCopy = _.cloneDeep(products);
                newCopy[i].name = e;
                setProducts(newCopy);
                // setCreatableValue(newOption);
              }}
              value={
                item.name == "" ? null : { label: item.name, value: item.name }
              }
            />
          </div>

          <div className="place-self-center">
            <Input
              className="justify-center items-stretch text-sm p-2 max-w-[8.175rem]  bg-gray-50 rounded-md"
              id="quantity"
              value={item.quantity}
              onChange={(e) => {
                const copy = _.cloneDeep(products);
                copy[i].quantity = parseInt(e.target.value);
                setProducts(copy);
              }}
              name="quantity"
              placeholder="1"
            />
          </div>
          <div className="flex space-x-3 items-center place-self-end">
            <Input
              className="justify-center items-stretch text-sm p-2 max-w-[8.125rem]  bg-gray-50 rounded-md"
              type="text"
              id="unit"
              name="functionalUnit"
              onChange={(e) => {
                const copy = _.cloneDeep(products);
                copy[i].functionalUnit = e.target.value;
                setProducts(copy);
              }}
              value={item.functionalUnit}
              placeholder="Kilowatt/hour"
              required
            />
            <X
              size={16}
              onClick={() => handleProductRemove(i)}
              className="text-slate-500"
              role="button"
            />
          </div>
        </div>
      ))}

      <div className="flex flex-col items-stretch self-end mt-8 max-w-full text-sm font-semibold leading-5 whitespace-nowrap">
        <Button
          variant={"ghost"}
          onClick={handleAddProductLine}
          className="text-blue-600 font-semibold hover:bg-white hover:text-blue-600"
        >
          + Add another product
        </Button>
        <div className="flex justify-end items-center space-x-2 mt-8">
          {(editPending || addPending) && (
            <Loader2 className="text-blue-600 animate-spin" />
          )}
          <Button
            type="button"
            size={"sm"}
            disabled={editPending || addPending}
            onClick={() => handleSubmit()}
            className="px-4 py-1.5 shadow"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const Productlist = ({
  period,
  setEdit,
  complete,
  setStatus,
}: {
  period: string;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  complete: { 1: boolean; 2: boolean; 3: boolean };
  setStatus: React.Dispatch<
    SetStateAction<{ 1: boolean; 2: boolean; 3: boolean }>
  >;
}) => {
  const prodLines = useQuery({
    queryKey: ["productlines", period],
    queryFn: () => getProductLines(period!),
  });
  const productLines = prodLines.isSuccess ? prodLines.data : [];

  useEffect(() => {
    if (prodLines.isSuccess) {
      if (productLines?.data?.FacilityProducts?.length == 0) {
        setEdit(true);
      } else {
        setStatus({ ...complete, 2: true });
      }
    }
  }, [prodLines.isSuccess, prodLines.data]);

  return (
    <section
      className="flex flex-col items-stretch self-stretch pb-1.5 text-base font-light leading-6 text-teal-800 bg-white rounded-lg"
      aria-label="Product Card"
    >
      {productLines?.data?.FacilityProducts?.map((item: any, i: number) => (
        <div
          key={i}
          className="grid grid-cols-3 gap-5 justify-between py-1 w-fit pr-20 max-md:flex-wrap max-md:pr-5 max-md:max-w-full"
        >
          <h1 className="font-bold whitespace-nowrap w-[8.125rem]">
            {item.name}
          </h1>
          <p className="w-[9.75rem]">{item.quantity} units</p>
          <p className="grow">{item.functional_unit}</p>
        </div>
      ))}
      <div className="self-end mt-5 mr-4 text-sm font-semibold leading-5 text-blue-600 max-md:mr-2.5">
        <Button
          type="button"
          variant={"ghost"}
          onClick={() => setEdit(true)}
          className="font-semibold hover:bg-white hover:text-blue-600"
        >
          Edit
        </Button>
      </div>
    </section>
  );
};

export default ProductLines;
