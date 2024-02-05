"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { HelpCircle, X } from "lucide-react";
import { Product } from "@/lib/types/product.type";
import { Button } from "../ui/button";
import _ from "lodash";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProductLines,
  editProductLines,
  getProductLines,
} from "@/services/facility.api";
import { toast } from "sonner";
import { useFormik } from "formik";

const ProductLines = ({ period }: { period: string }) => {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");
  const [isEdit, setEdit] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([
    { name: "", quantity: 0, functionalUnit: "" },
  ]);

  const prodLines = useQuery({
    queryKey: ["product-lines", period],
    queryFn: () => getProductLines(period!),
  });
  const productLines = prodLines.isSuccess ? prodLines.data : [];
  console.log(productLines.data);

  const { mutate } = useMutation({
    mutationFn: addProductLines,
    onSuccess: (data) => {
      toast.success("Products Lines added.", { style: { color: "green" } });
      queryClient.invalidateQueries({ queryKey: ["product-lines", period] });
      setEdit(false);
    },
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: editProductLines,
    onSuccess: (data) => {
      toast.success("Products Lines updated.", { style: { color: "green" } });
      queryClient.invalidateQueries({ queryKey: ["product-lines", period] });
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
    if (productLines.data.length == 0) {
      mutate(formData);
    } else {
      console.log(formData);
      editMutate(formData);
    }
  };

  useEffect(() => {
    if (prodLines.isSuccess) {
      const updated = productLines.data?.map((item: Product) => ({
        ...item,
        functionalUnit: item?.functional_unit,
      }));
      console.log({ updated });
      setProducts(updated);
    }
  }, [prodLines.status]);

  return (
    <>
      {isEdit ? (
        <div className="flex flex-col items-stretch self-stretch text-xs leading-4 bg-white rounded-lg">
          <header className="grid grid-cols-3 gap-5  px-5 py-2 w-full font-bold border-b border-solid border-b-slate-200 text-slate-700 max-md:flex-wrap max-md:max-w-full">
            <div className="flex-auto">Product Name</div>
            <div className="flex-auto my-auto">Quantity (unit)</div>
            <div className="flex gap-3 self-start pr-3">
              <div>Functional Unit</div>
              <HelpCircle size={16} className="text-white fill-slate-600" />
            </div>
          </header>
          {products.map((item: Product, i: number) => (
            <div
              key={i}
              className="gap-5 grid grid-cols-3 mt-6 w-full whitespace-nowrap text-slate-700 max-md:flex-wrap max-md:max-w-full"
            >
              <div>
                <Input
                  className="justify-center items-stretch text-xs p-2 max-w-[14.75rem] bg-gray-50 rounded-md"
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
                  placeholder="product1"
                />
              </div>

              <div>
                <Input
                  className="justify-center items-stretch text-xs p-2 max-w-[8.175rem] bg-gray-50 rounded-md"
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
                  className="justify-center items-stretch text-xs p-2 max-w-[8.125rem] bg-gray-50 rounded-md"
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
            <Button
              type="button"
              size={"sm"}
              onClick={() => handleSubmit()}
              className="self-end px-4 py-1.5 mt-8  shadow"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <section
          className="flex flex-col items-stretch self-stretch pb-1.5 text-base font-light leading-6 text-teal-800 bg-white rounded-lg"
          aria-label="Product Card"
        >
          {productLines.data?.map((item: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-5 justify-between py-1 w-fit pr-20 max-md:flex-wrap max-md:pr-5 max-md:max-w-full"
            >
              <h1 className="font-bold whitespace-nowrap w-[8.125rem]">
                {item.name}
              </h1>
              <p className="w-[9.75rem]">{item.quantity} units</p>
              <p className="grow">{item.functionalUnit}</p>
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
      )}
    </>
  );
};

export default ProductLines;
