"use client";

import React, { Suspense, useEffect, useState } from "react";
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

const ProductLines = ({ period }: { period: string }) => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");
  const [isEdit, setEdit] = useState(false);
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([
    { name: "", quantity: 0, functionalUnit: "" },
  ]);

  const prodLines = useQuery({
    queryKey: ["product-lines", period],
    queryFn: () => getProductLines(period!),
  });
  const productLines = prodLines.isSuccess ? prodLines.data : [];
  // console.log(productLines);

  const productNamesQ = useQuery({
    queryKey: ["product-names", facilityId!],
    queryFn: () => getAllFacilityProductNames(facilityId!),
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
        queryKey: [
          "product-lines",
          period,
          "reporting-periods",
          "product-emissions",
          "productlines",
        ],
        exact: true,
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
      mutate(formData);
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
      // console.log({ updated });
      setProducts(updated);
      if (updated.length == 1) {
        setEdit(true);
      }
    }
  }, [prodLines.status, prodLines.data]);

  return (
    <>
      {isEdit ? (
        <Suspense fallback={<Loader2 className="animate-spin text-blue-400" />}>
          <div className="flex flex-col items-stretch self-stretch text-xs leading-4 bg-white rounded-lg">
            <header className="grid grid-cols-3 gap-5   py-2 w-full font-bold border-b border-solid border-b-slate-200 text-slate-700 md:flex-wrap md:max-w-full">
              <div className="flex-auto">Product Name</div>
              <div className="flex-auto my-auto">Quantity (unit)</div>
              <div className="flex gap-3 self-start pr-3">
                <div>Functional Unit</div>

                <TooltipProvider delayDuration={800}>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle
                        size={16}
                        className="text-white fill-slate-600"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 max-w-[246px] px-2.5 py-3 rounded shadow-sm">
                      <p className=" text-xs leading-4 text-white">
                        A functional unit in sustainability is a measure of
                        performance that quantifies the environmental impacts of
                        a system, used to compare different products or
                        processes within a defined context.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </header>

            {products.map((item: Product, i: number) => (
              <div
                key={i}
                className="gap-5 grid grid-cols-3 mt-6 w-full whitespace-nowrap text-slate-700 max-md:flex-wrap max-md:max-w-full"
              >
                <div>
                  <CreatableSelect
                    options={nameList}
                    onChange={(e) => {
                      const copy = _.cloneDeep(products);
                      copy[i].name = e?.label;
                      setProducts(copy);
                    }}
                    styles={customDropdownStyles}
                    placeholder="Select..."
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
                    value={{ label: item.name, value: item.name }}
                  />
                  {/* <Input
                    className="justify-center items-stretch text-xs p-2 max-w-[14.75rem] 2xl:max-w-[70%] bg-gray-50 rounded-md"
                    type="text"
                    id="product-name"
                    value={item.name}
                    onChange={(e) => {
                      const copy = _.cloneDeep(products);
                      copy[i].name = e.target.value;
                      setProducts(copy);
                    }}
                    name="product-name"
                    required
                    placeholder="Add product name "
                  /> */}
                </div>

                <div>
                  <Input
                    className="justify-center items-stretch text-xs p-2 max-w-[8.175rem] 2xl:max-w-[40%] bg-gray-50 rounded-md"
                    type="number"
                    id="quantity"
                    value={item.quantity}
                    onChange={(e) => {
                      const copy = _.cloneDeep(products);
                      copy[i].quantity = Number(e.target.value);
                      setProducts(copy);
                    }}
                    name="quantity"
                    required
                    placeholder="1"
                  />
                </div>
                <div className="flex space-x-3 items-center">
                  <Input
                    className="justify-center items-stretch text-xs p-2 max-w-[8.125rem] 2xl:max-w-[40%] bg-gray-50 rounded-md"
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
              <div className="flex items-center space-x-2 mt-8">
                {(editPending || addPending) && (
                  <Loader2 className="text-blue-600 animate-spin" />
                )}
                <Button
                  type="button"
                  size={"sm"}
                  disabled={editPending || addPending}
                  onClick={() => handleSubmit()}
                  className="self-end px-4 py-1.5 shadow"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Suspense>
      ) : (
        <Productlist period={period} setEdit={setEdit} />
      )}
    </>
  );
};

const Productlist = ({
  period,
  setEdit,
}: {
  period: string;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const prodLines = useQuery({
    queryKey: ["productlines", period],
    queryFn: () => getProductLines(period!),
  });
  const productLines = prodLines.isSuccess ? prodLines.data : [];

  return (
    <Suspense fallback={<Loader2 className="animate-spin text-blue-400" />}>
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
    </Suspense>
  );
};

export default ProductLines;
