"use client";
import { ChevronLeft, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import AutocompleteInput from "../Autocomplete";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { number, string, z } from "zod";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  addSupplier,
  createSupplierProduct,
  getProductNamesBySupplierId,
  getProductTypesBySupplierId,
  getReportingPeriodById,
  getSupplierDetailsById,
  updateSupplier,
} from "@/services/supply.chain";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CreatableSelect from "react-select/creatable";

import { cn, converPeriodToString, formatReportingPeriod } from "@/lib/utils";
import { report } from "process";
import { ChevronDown, HelpCircle, Loader2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import _, { set } from "lodash";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const EditSupplier = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const reportingId = searchParams.get("reportingId");
  const supplierId: any = params.id;
  const [editSupplier, setEditSupplier] = useState(true);
  const [editProductTable, setEditProductTable] = useState(false);
  const [totalScopeValue, setTotalScopeValue] = useState(0);
  const [currentReportingPeriod, setCurrentReportingPeriod] = useState("");
  const [isAddEdit, setIsAddEdit] = useState(false);
  const [productList, setProductList] = useState<any>([
    {
      id: "",
      name: "",
      type: "",
      quantity: null,
      functional_unit: null,
      scope_3Contribution: 0,
    },
  ]);
  const [err, setErr] = useState<
    {
      name?: string;
      type?: string;
      quantity?: number | null;
      functional_unit?: string;
      scope_3Contribution?: number | null;
    }[]
  >([]);
  const [createableValue, setCreatableValue] = useState<any>("");
  const [createableTypeValue, setCreatableTypeValue] = useState<any>("");
  const session = useSession();
  console.log(currentReportingPeriod, "reportingId");

  //console.log(reportingPeriod, 'reportingPeriod');
  const supplierQ = useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: () => getSupplierDetailsById(supplierId!),
  });
  const reportingPeriodQ = useQuery({
    queryKey: ["reporting-period", currentReportingPeriod],
    queryFn: () =>
      getReportingPeriodById(
        currentReportingPeriod ? currentReportingPeriod : ""
      ),
  });

  const reportingPeriod = reportingPeriodQ.isSuccess
    ? reportingPeriodQ.data.data
    : null;
  const supplier = supplierQ.isSuccess ? supplierQ.data.data : {};
  // console.log('supplier', supplier);
  const formattedDate = dayjs(supplier.updated_at).format("DD/MM/YYYY");

  const relationShips = ["OWNED", "CONTRACTED"];

  const validation = z.object({
    // name: z.string(),
    email: z.string().email(),
    // organizationRelationship: z.string(),
    address: z.string(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addSupplier,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      setValues({
        ...data.data,
        organizationRelationship: data.data.organization_relationship,
      });
      toast.success("New Supplier Added", { style: { color: "green" } });
      setEditSupplier(true);
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const { mutate: editSupplierMut } = useMutation({
    mutationFn: updateSupplier,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      console.log("supplier updated : ", data);
      queryClient.invalidateQueries({
        queryKey: ["supplier", supplierId],
      });
      //   setSupplier(data);
      setValues(data.data);
      toast.success("Supplier Updated", { style: { color: "green" } });
      setEditSupplier(true);
      // router.push('/supply-chain');
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const { mutate: addSupplierProductsMut } = useMutation({
    mutationFn: createSupplierProduct,
    onSuccess: (data) => {
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      queryClient.invalidateQueries({
        queryKey: ["supplier", supplierId],
      });

      // console.log('supplier products created: ', data);
      toast.success("Supplier Created", { style: { color: "green" } });

      setEditProductTable(false);
      router.push("/supply-chain");
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const {
    values,
    handleSubmit,
    handleChange,
    errors,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      id: supplier?.id ? supplier.id : "",
      supplyChainReportingPeriodId: reportingId,
      name: "",
      email: "",
      organizationRelationship: "",
      address: "",
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data) => {
      console.log("add supplier : ", data);
      data = { ...data, supplyChainReportingPeriodId: reportingId };
      if (supplier?.id) {
        editSupplierMut(data);
      } else {
        mutate(data);
      }
    },
  });

  const handleCreate = (inputValue: string, i: number) => {
    const newOption = {
      id: "",
      name: inputValue,
      quantity: "",
      type: "",
      functional_unit: "",
      scope_3Contribution: "",
    };
    const newCopy = _.cloneDeep(productList);
    newCopy[i].name = inputValue;
    setProductList(newCopy);
    setCreatableValue(newOption);
  };

  const customDropdownStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: "none",
      borderColor: "none", // Hide border color when menu is open
      background: "#F9FAFB",
      borderRadius: "6px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const handleCreateType = (inputValue: string, i: number) => {
    const newOption = {
      id: "",
      name: "",
      quantity: "",
      type: inputValue,
      functional_unit: "",
      scope_3Contribution: "",
    };
    const newCopy = _.cloneDeep(productList);
    newCopy[i].type = inputValue;
    setProductList(newCopy);
    setCreatableTypeValue(newOption);
  };
  const productNamelist = productList.map((item: any) => ({
    label: item.name,
    value: item.name,
  }));
  const productTypelist = productList.map((item: any) => ({
    label: item.type,
    value: item.type,
  }));
  useEffect(() => {
    if (supplierQ.isSuccess) {
      setValues(supplier);
      setCurrentReportingPeriod(supplier.supplyChainReportingPeriod.id);

      console.log(supplier, "supplier1");
      setFieldValue(
        "organizationRelationship",
        supplier.organization_relationship
      );
      const newSupplierList = supplier.supplierProducts.map((product: any) => ({
        ...product,
        scope_3Contribution: product.scope_3_contribution,
      }));
      setProductList(newSupplierList);
      const total = newSupplierList.reduce(
        (total: number, currentItem: any) =>
          (total = total + currentItem.scope_3Contribution!),
        0
      );
      setTotalScopeValue(total);
    }
  }, [supplierQ.status]);

  console.log(err);

  return (
    <div className="flex flex-col flex-start p-6 w-full">
      <header className="flex gap-2.5 self-stretch p-3 text-sm items-center leading-5 text-blue-600 max-md:flex-wrap">
        <ChevronLeft
          size={24}
          className="text-slate-500 cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <div className="flex-auto max-md:max-w-full">
          <Link href={"/supply-chain"} className="text-slate-500">
            Supply Chain &gt;
            <span className="font-bold text-blue-600 ml-2 capitalize">
              {supplier?.name}
            </span>
          </Link>
        </div>
      </header>

      <div className="flex gap-5 justify-between px-[40px] self-stretch max-md:flex-wrap">
        <div className="text-lg mt-2 font-bold leading-7 text-center text-gray-700">
          {supplier?.name}
        </div>
        <p className="justify-center px-2 py-0.5 my-auto text-xs font-medium leading-4 text-cyan-800 whitespace-nowrap bg-cyan-50 rounded-md">
          Reporting Period:
          <span>
            {reportingPeriod && converPeriodToString(reportingPeriod)}
          </span>
        </p>
      </div>
      <div className="text-sm leading-5 text- w-full px-[40px]  text-slate-800">
        <p className="py-6">Edit your supplier product information</p>
      </div>

      <div className="flex flex-col self-stretch py-6 mx-10 rounded border border-solid border-[color:var(--Gray-200,#E5E7EB)]">
        <div className="flex flex-col px-6 w-full max-md:px-5 max-md:max-w-full">
          {editSupplier ? (
            <div>
              <div className="edit-section">
                <div className="flex gap-5 justify-between self-stretch items-center mb-6 max-md:flex-wrap">
                  <div className="flex gap-2.5 items-center self-start text-base font-bold leading-6 text-slate-800 max-md:flex-wrap max-md:max-w-full">
                    <div className="flex justify-center items-center px-0.5 w-5 h-5 bg-blue-600 rounded-[100px]">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b2283a52b7c418fce477d355fd576ce8654d424c746c4d454e724c05c7236019?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                        className="w-full aspect-square"
                      />
                    </div>
                    <div className="grow max-md:max-w-full">
                      Supplier Information
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditSupplier(false);
                      setFieldValue(
                        "organizationRelationship",
                        supplier.organization_relationship
                      );
                    }}
                    className="text-sm font-semibold leading-5 text-blue-600"
                  >
                    Edit
                  </Button>
                </div>
                <div className="text-xs font-medium leading-5 text-green-900 max-w-[515px]">
                  <p className="text-slate-500">
                    Supplier Name:{" "}
                    <span className="text-green-900">{supplier?.name}</span>
                  </p>
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="text-green-900"> {supplier?.email}</span>
                  <br />
                  <span className="text-slate-500">
                    Relationship to Organization:{" "}
                  </span>
                  <span className="text-green-900">
                    {supplier?.organization_relationship}
                  </span>
                  <br />
                  <span className="text-slate-500">Supplier Address:</span>{" "}
                  <span className="text-green-900">{supplier?.address}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex gap-2.5 self-start max-md:flex-wrap max-md:max-w-full">
                <div className="flex justify-center items-center px-1.5 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]">
                  1
                </div>
                <div className="grow text-base font-bold leading-6 text-slate-800 max-md:max-w-full">
                  Supplier Information
                </div>
              </div>
              <div className="mt-6 text-sm leading-5  text-slate-800 max-md:max-w-full">
                Add the basic information about your supplier
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex gap-5 pr-20 mt-6 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
                  <div className=" my-auto font-medium text-slate-700">
                    Supplier Name
                  </div>
                  <Input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={cn(
                      "grow justify-center bg-gray-50 text-slate-700 max-md:pr-5 max-w-[337px]",
                      errors?.name && "border border-red-500"
                    )}
                  />
                </div>

                <div className="flex gap-5 self-stretch pr-20 mt-6 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5">
                  <div className=" my-auto font-medium text-slate-700">
                    Contact Email{" "}
                  </div>
                  <div className="w-[337px] relative">
                    <Input
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      className={cn(
                        "grow justify-center py-3.5 pr-8 pl-2 bg-gray-50  rounded-md text-slate-700 max-md:pr-5",
                        errors?.email && "border border-red-500"
                      )}
                    />
                    <span className="absolute left-0 bottom-[-19px] text-xs text-red-400">
                      {errors?.email}
                    </span>
                  </div>
                </div>

                <div className="flex gap-5  pr-20 mt-6 text-xs max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
                  <div className="my-auto font-medium leading-4 text-slate-700">
                    Relationship <br />
                    to organization
                  </div>
                  <div className="flex gap-2 justify-between whitespace-nowrap  text-slate-700 h-[44px] min-w-[153px]">
                    <Select
                      value={values.organizationRelationship}
                      onValueChange={(e) => {
                        console.log("value changed : ", e);
                        setFieldValue("organizationRelationship", e);
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "text-slate-500 text-sm font-light leading-5  bg-gray-50 py-6 rounded-md max-md:max-w-full",
                          errors?.organizationRelationship && " border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select relation to organization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="text-sm">
                          {relationShips?.map((rel: string, index: number) => (
                            <SelectItem key={index} value={rel}>
                              {rel}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-5 justify-between items-center mt-6 max-md:flex-wrap max-md:max-w-full mb-6">
                  <div className="grow text-xs font-medium leading-4 text-slate-700 max-md:max-w-full">
                    Supplier Address
                  </div>
                  <p
                    className="cursor-pointer my-auto text-sm font-semibold leading-4 text-center text-blue-600"
                    onClick={() => setIsAddEdit(true)}
                  >
                    Edit
                  </p>
                </div>
                <div className="max-w-[768px] relative min-h-[44px]">
                  <AutocompleteInput
                    isDisabled={!isAddEdit}
                    setAddress={(a: string) => {
                      setFieldValue("address", a);
                      console.log(a, "address");
                      console.log("first");
                    }}
                    address={values.address}
                  />
                  <span className="absolute left-0 text-xs bottom-[-19px] text-red-400">
                    {errors?.address}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    type="submit"
                    className="justify-center self-end px-4 py-2 mt-6 text-sm font-semibold leading-4 text-center text-blue-600 whitespace-nowrap rounded border-2 border-solid aspect-[2.03] border-[color:var(--Accent-colors-Sparkle---Active,#2C75D3)] max-md:mr-2.5"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col self-stretch p-6 rounded border mt-6 mx-10 border-solid border-[color:var(--Gray-200,#E5E7EB)] max-md:px-5">
        <div className="flex gap-2.5 mb-6 justify-between items-center max-md:flex-wrap max-md:max-w-full">
          {!editProductTable && (
            <div className="flex justify-center items-center px-0.5 w-5 h-5 bg-blue-600 rounded-[100px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b2283a52b7c418fce477d355fd576ce8654d424c746c4d454e724c05c7236019?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                className="w-full aspect-square"
              />
            </div>
          )}
          {editProductTable && (
            <div className="flex justify-center items-center px-1.5 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]">
              2
            </div>
          )}
          <div className="flex-auto text-base font-bold leading-6 text-slate-800 max-md:max-w-full">
            Product & Product Level Contribution
          </div>
          {!editProductTable && (
            <Button
              variant={"ghost"}
              onClick={() => setEditProductTable(true)}
              className="text-blue-600 hover:text-blue-600 font-semibold"
            >
              Edit
            </Button>
          )}
        </div>

        {editProductTable ? (
          <>
            <div className="text-sm leading-5 text-slate-800 max-md:max-w-full">
              Enter the product type, product name, units created each year, and
              the functional unit associated with the product. If you know the
              total Scope 3 contributions for the given quantity of each
              product, enter it here
            </div>
            <Table className="">
              <TableHeader className="border-b">
                <TableHead className="text-xs pl-0 pr-4">
                  Product Name
                </TableHead>
                <TableHead className="text-xs pl-0 pr-4">
                  Product Type
                </TableHead>
                <TableHead className="text-xs pl-0 pr-4">Quantity</TableHead>
                <TableHead className="flex gap-3 pl-0 pr-4 text-xs justify-between items-center relative">
                  <div className="flex items-center">
                    Functional Unit
                    <TooltipProvider delayDuration={800}>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="ml-2" size={12}></HelpCircle>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 max-w-[246px]">
                          <p className="pt-2 pb-2.5 text-xs leading-4 text-white rounded shadow-sm ">
                            A functional unit in sustainability is a measure of
                            performance that quantifies the environmental
                            impacts of a system, used to compare different
                            products or processes within a defined context.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead className="grow pl-0 pr-4 whitespace-nowrap text-xs">
                  Scope 3 Contribution (kgCO2)
                </TableHead>
                <TableHead></TableHead>
              </TableHeader>
              <TableBody>
                {productList.map((item: any, i: number) => (
                  <TableRow key={i} className="mt-4 border-0">
                    <TableCell className="py-3 px-3 pl-0 pr-4">
                      <div
                        className={cn("2xl:w-[303px] w-[179px]", err[i]?.name)}
                      >
                        <CreatableSelect
                          // isClearable
                          options={productNamelist}
                          styles={customDropdownStyles}
                          onChange={(newValue) => {
                            const copy = _.cloneDeep(productList);
                            copy[i].name = newValue?.value;
                            setProductList(copy);
                          }}
                          placeholder="Add Product name"
                          onCreateOption={(e) => handleCreate(e, i)}
                          value={
                            item.name == null
                              ? null
                              : { label: item.name, value: item.name }
                          }
                        />
                      </div>
                      <p className="text-xs text-red-500">{err[i]?.name}</p>
                    </TableCell>
                    <TableCell className="pl-0 py-3 pr-4">
                      <div
                        className={cn(
                          "2xl:w-[303px] w-[179px]",
                          err[i]?.type && "border border-red-500"
                        )}
                      >
                        <CreatableSelect
                          // isClearable
                          options={productTypelist}
                          styles={customDropdownStyles}
                          onChange={(newValue) => {
                            const copy = _.cloneDeep(productList);
                            copy[i].type = newValue?.value;
                            setProductList(copy);
                          }}
                          value={
                            item.type == null
                              ? null
                              : { label: item.type, value: item.type }
                          }
                          placeholder="Add Product Type"
                          onCreateOption={(e) => handleCreateType(e, i)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pl-0 pr-4 py-3">
                      <div className="2xl:w-[303px] w-[163px]">
                        <Input
                          type="number"
                          value={item.quantity}
                          placeholder="unit"
                          onChange={(e) => {
                            const newCopy = _.cloneDeep(productList);
                            newCopy[i].quantity = e.target.value.toString();
                            setProductList(newCopy);
                          }}
                          className={cn(
                            "bg-[#F9FAFB] rounded-md",
                            err[i]?.quantity && "border border-red-500"
                          )}
                        />
                        <p className="text-xs text-red-500">
                          {err[i]?.quantity}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="pl-0 pr-4 py-3">
                      <div className="2xl:w-[225px] w-[125px]">
                        <Input
                          value={item.functional_unit}
                          placeholder="kilowatt/hr"
                          onChange={(e) => {
                            const newCopy = _.cloneDeep(productList);
                            newCopy[i].functional_unit = e.target.value;
                            setProductList(newCopy);
                          }}
                          className={cn(
                            "bg-[#F9FAFB] rounded-md",
                            err[i]?.functional_unit && "border border-red-500"
                          )}
                        />
                        <p className="text-xs text-red-500">
                          {err[i]?.functional_unit}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="pl-0 pr-4 py-3 w-[163px]">
                      <div className="2xl:w-[215px] w-[125px]">
                        <Input
                          type="number"
                          value={
                            item.scope_3Contribution === 0
                              ? ""
                              : item.scope_3Contribution
                          }
                          placeholder="kgCO2"
                          onChange={(e) => {
                            const newCopy = _.cloneDeep(productList);
                            newCopy[i].scope_3Contribution = parseInt(
                              e.target.value
                            );
                            setProductList(newCopy);
                          }}
                          className={cn(
                            "bg-[#F9FAFB] rounded-md ",
                            err[i]?.scope_3Contribution &&
                              "border border-red-500"
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="pl-0 pr-4 py-3">
                      {productList.length - 1 == i ? (
                        <Plus
                          size={16}
                          role="button"
                          onClick={() => {
                            const newCopy = _.cloneDeep(productList);
                            newCopy.push({
                              id: "",
                              name: null,
                              type: null,
                              quantity: "",
                              functional_unit: null,
                              scope_3Contribution: 0,
                            });

                            setProductList(newCopy);
                          }}
                        />
                      ) : (
                        <X
                          size={16}
                          role="button"
                          onClick={() => {
                            const newCopy = _.cloneDeep(productList);
                            newCopy.splice(i, 1);
                            setProductList(newCopy);
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant={"ghost"}
              onClick={() => {
                let res: any;
                if (productList.length > 1) {
                  res = z
                    .array(
                      z.object({
                        name: z
                          .string()
                          .min(3, {
                            message: "Minimum length should be 3",
                          })
                          .optional()
                          .nullable(),
                        type: z
                          .string()
                          .trim()
                          .min(1, { message: "Required" })
                          .optional()
                          .nullable(),
                        quantity: z
                          .string({
                            invalid_type_error: "Please enter a valid number",
                          })
                          .optional()
                          .nullable(),
                        functional_unit: z
                          .string({
                            invalid_type_error: "Please enter a valid unit",
                          })
                          .trim()
                          .min(1, { message: "Required" })
                          .optional()
                          .nullable(),
                        scope_3Contribution: z.number().optional().nullable(),
                      })
                    )
                    .safeParse(productList);
                } else {
                  res = z
                    .array(
                      z.object({
                        name: z.string().min(3, {
                          message: "Minimum length should be 3",
                        }),
                        type: z.string().trim().min(1, { message: "Required" }),
                        quantity: z.string({
                          invalid_type_error: "Please enter a valid number",
                        }),
                        functional_unit: z
                          .string({
                            invalid_type_error: "Please enter a valid unit",
                          })
                          .trim()
                          .min(1, { message: "Required" }),
                        scope_3Contribution: z.number().optional(),
                      })
                    )
                    .safeParse(productList);
                }

                if (res.success) {
                  setErr([]);

                  const filteredData = productList.filter(
                    (item: any) =>
                      item.name !== null &&
                      item.type !== null &&
                      item.functional_unit !== null
                  );
                  const data: any = {
                    supplierId: supplier?.id,
                    supplierProducts: filteredData,
                  };

                  console.log("data: ", data);

                  addSupplierProductsMut(data);
                  // setCompleteStep(true);
                } else {
                  let errorList: { [key: string]: string }[] = [];
                  res.error.errors.map((item: any) => {
                    const [index, key] = item.path;
                    const message = item.message;
                    if (!errorList[index as number]) {
                      errorList[index as number] = {};
                    }
                    errorList[index as number][key] = message;
                  });
                  setErr(errorList);
                }
                // console.log(productList, "productList");

                // console.log("edit list : ", productList);
                // addSupplierProductsMut(data);
              }}
              className="justify-center self-end px-4 py-2 mt-6 text-sm font-semibold leading-4 text-center text-blue-600 whitespace-nowrap rounded border-2 border-solid aspect-[2.03] border-[color:var(--Accent-colors-Sparkle---Active,#2C75D3)]"
            >
              Save
            </Button>
          </>
        ) : (
          <div>
            {productList.map((item: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center text-base leading-4 text-green-900 mb-6"
              >
                <div className="space-y-1">
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm">{item.type}</p>
                </div>

                <p className="text-base leading-4 text-green-900">
                  {item.scope_3Contribution == null ? (
                    "Not Available"
                  ) : (
                    <p>
                      {item.scope_3Contribution} {""}
                      <span>kgCO2</span>
                    </p>
                  )}
                </p>
              </div>
            ))}
            <div className="flex justify-between items-center text-base font-bold leading-4 text-green-900">
              <p>Total</p>
              <p>
                {totalScopeValue}
                {""} <span>kgCO2</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start mx-10 my-6">
        <div className="flex gap-2 self-stretch text-xs mb-6 font-medium leading-4 text-slate-800">
          <Image
            src={"/assets/images/user-icon.svg"}
            alt="close-icon"
            height={16}
            width={16}
            className="w-4 aspect-square"
          />
          <div className="flex-auto">Updated By: {supplier.updated_by}</div>
        </div>
        <div className="flex gap-2 self-stretch text-xs font-medium leading-4 text-slate-800">
          <Image
            src={"/assets/images/watch-icon.svg"}
            alt="close-icon"
            height={16}
            width={16}
            className="w-4 aspect-square"
          />

          <div className="last-updated">Last Updated: {formattedDate}</div>
        </div>
      </div>
    </div>
  );
};
export default EditSupplier;
