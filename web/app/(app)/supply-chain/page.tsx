"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  addReportingPeriod,
  downloadCsvTemplate,
  getAllEmissioScopeData,
  getAllReportingPeriods,
  getAllSuppliersByPeriodId,
  importFile,
} from "@/services/supply.chain";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import ReportingPeriodPopup from "@/components/supply-chain/reporting-period-popover";
import dayjs from "dayjs";
import AddSupplierManualy from "@/components/supply-chain/addSupplierManualy";
import SupplierData from "@/components/supply-chain/SupplierData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import download from "downloadjs";
import { convertDateToString } from "@/lib/utils";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [showNew, setShowNew] = useState(false);
  const session = useSession();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [uploadStatus, setUploadStatus] = useState("select");
  const [selectedProductIds, setSelectedProductIds] = useState<any>([]);

  const organizationId = session?.data?.user.organizations[0].id!;

  const periodsQ = useQuery({
    queryKey: ["reporting-periods", organizationId],
    queryFn: () => getAllReportingPeriods(organizationId),
  });
  const reportingPeriods = periodsQ.isSuccess ? periodsQ.data.data : [];
  // console.log(session.data? session.data.user.organizations[0].id:"", 'session.data');
  console.log(reportingPeriods, "reportingPeriods");
  function handleChange(event: any) {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }
  function handleSubmit(event: any) {
    event.preventDefault();
    const formData = {
      supplierCSV: fileName,
      supplyChainReportingPeriodId: "f942aa90-6dc1-45a4-bc12-bf53e9f38468",
    };
    // formData.append('file', file);
    mutate(formData);
  }
  const { mutate, isPending } = useMutation({
    mutationFn: importFile,
    onSuccess: (data) => {},
    onError: (err) => {
      toast.error(err.message, { style: { color: "red" } });
    },
  });

  const DownloadTemplate = () => {
    downloadCsvMUt.mutate();
  };
  const downloadCsvMUt = useMutation({
    mutationFn: downloadCsvTemplate,
    onSuccess: (data) => {
      download(
        data?.data.download_url,
        "Supplier_GHG_Emissions_CSV_Template.csv",
        "text/csv"
      );
      console.log(data?.data.download_url, "data dsfasdf");
      toast.success("csv downloaded Successfully.", {
        style: { color: "green" },
      });
    },
    onError: (err) => {
      alert(err);
      toast.error(err.message, { style: { color: "red" } });
    },
  });
  const emptyInput = () => {
    setFileName("");
  };

  const handleCheckboxChange = (event: any) => {
    const productId = event.target.value;
    if (event.target.checked) {
      if (!selectedProductIds.includes(productId)) {
        setSelectedProductIds((prevIds: any) => [...prevIds, productId]);
      }
    } else {
      setSelectedProductIds((prevIds: any) =>
        prevIds.filter((id: string) => id !== productId)
      );
    }
  };

  const areAllSelected = () => {
    // Assuming supplierProducts is an array of all products you are iterating over
    // This checks if every product ID is in the selectedProductIds array
    const allProductIds = supplierProducts.map((product: any) => product.id);
    return (
      allProductIds.length > 0 &&
      allProductIds.every((id: string) => selectedProductIds.includes(id))
    );
  };

  const handleSelectAllChange = (event: any) => {
    if (event.target.checked) {
      // Select all: add all product IDs to the selectedProductIds state
      const allProductIds = supplierProducts.map((product: any) => product.id);
      setSelectedProductIds(allProductIds);
    } else {
      // Deselect all: clear the selectedProductIds state
      setSelectedProductIds([]);
    }
  };

  const handleSelectAllButtonClick = () => {
    const allProductIds = supplierProducts.map((product: any) => product.id);

    // If not all products are currently selected, select all, otherwise deselect all
    if (areAllSelected()) {
      // Deselect all if currently all are selected
      setSelectedProductIds([]);
    } else {
      // Select all if not all products are currently selected
      setSelectedProductIds(allProductIds);
    }
  };

  const token = session?.data?.token.token;

  useEffect(() => {
    if (periodsQ.isSuccess) {
      setCurrentTab(reportingPeriods[0]?.id);
    }
  }, [periodsQ.isSuccess]);

  const supplierProductsQ = useQuery({
    queryKey: ["supplier-products", currentTab],
    queryFn: () => getAllSuppliersByPeriodId(currentTab),
  });
  const supplierProducts = supplierProductsQ.isSuccess
    ? supplierProductsQ.data.data
    : [];

  return (
    <div className="w-full shadow bg-gray-50 flex flex-col pl-6 pr-6 pt-5 pb-12 max-md:px-5">
      <header className="justify-between items-center self-stretch flex gap-5 py-2 max-md:flex-wrap max-md:px-5">
        <div className="overflow-hidden text-slate-800 text-ellipsis text-base font-semibold leading-6 my-auto">
          Pepsi Co
        </div>
        <div className="justify-center self-stretch flex flex-col pl-16 py-6 items-end max-md:max-w-full max-md:pl-5">
          <div className="text-gray-900 text-xs font-medium leading-4 whitespace-nowrap justify-center items-stretch bg-gray-50 p-2 rounded-md">
            NAICS: 3241
          </div>
        </div>
      </header>
      <div className="w-full flex justify-end items-center">
        <div
          className="rounded flex gap-1.5 px-3.5 py-1.5 cursor-pointer"
          onClick={() => setShowNew(true)}
        >
          <header className="text-blue-600 text-sm font-semibold leading-5 self-stretch grow whitespace-nowrap">
            + Add Reporting Period
          </header>
        </div>
      </div>
      {periodsQ.isSuccess && (
        <Tabs
          className="w-full"
          value={showNew ? "new" : currentTab!}
          onValueChange={setCurrentTab}
        >
          <TabsList>
            {showNew && (
              <TabsTrigger value="new">
                <Popover defaultOpen={true}>
                  <PopoverTrigger> Add Reporting Period</PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-full left-0 p-0 -ml-4"
                  >
                    <ReportingPeriodPopup setNew={setShowNew} />
                  </PopoverContent>
                </Popover>
              </TabsTrigger>
            )}

            {reportingPeriods.map((item: any, i: number) => {
              const reporting = `${dayjs(item.reporting_period_from).format(
                "MMM YYYY"
              )} - ${dayjs(item.reporting_period_to).format("MMM YYYY")}`;
              return (
                <TabsTrigger
                  key={i}
                  value={item.id}
                  onClick={() => setCurrentTab(item.id)}
                >
                  <Popover>
                    <PopoverTrigger className="">{reporting}</PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-full left-0 p-0 -ml-4"
                    >
                      <ReportingPeriodPopup setNew={setShowNew} period={item} />
                    </PopoverContent>
                  </Popover>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={currentTab!} className="relative">
            <SupplierData periodId={currentTab!}></SupplierData>
          </TabsContent>
          <TabsContent value="new">
            <div className="justify-center items-center self-stretch border border-[color:var(--Gray-50,#F9FAFB)] bg-white flex flex-col px-20 py-12 rounded-lg border-solid max-md:px-5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9125c29d6e22fd51a2f1e9dcb27da44ac69b93ebcdb1009043a3b8178d6d05e3?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                className="aspect-[1.17] object-contain object-center w-[54px] overflow-hidden self-center max-w-full mt-9"
              />
              <div className="text-slate-700 text-3xl font-semibold leading-9 self-center mt-3 max-md:max-w-full">
                Upload supplier product level emissions data
              </div>
              <div className="text-slate-700 text-center text-lg font-light leading-7 self-stretch w-full mt-6 max-md:max-w-full max-md:mr-2">
                Your suppliers product-level emission data encompasses the Scope
                3 emissions directly linked to your products. To begin, upload
                this information using a CSV file or enter the data manually in
                the table below.
                <br />
              </div>
              <Dialog>
                <DialogTrigger>
                  <Button
                    disabled
                    className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center mt-6 mb-9 px-4 py-3"
                  >
                    Upload CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[44rem] p-[60px]">
                  <DialogDescription>
                    <div className="bg-white flex max-w-[707px] flex-col items-end">
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d846c09ab3f4187b63077673a631850dbed6d5d8a2e8740d3dfc3f933dba7c58?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                            className="aspect-square object-contain object-center w-6 overflow-hidden max-w-full max-md:mr-2.5"
                          />
                        </Button>
                      </DialogClose>

                      <div className="text-gray-800 text-center text-xl font-bold leading-7 self-stretch max-md:max-w-full">
                        Import Supplier GHG Emissions
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="self-stretch flex w-full flex-col mt-4 mb-0 max-md:max-w-full max-md:px-5">
                          <div className="text-gray-800 text-xl leading-7 self-stretch w-full mr-4 mt-4 max-md:max-w-full max-md:mr-2.5">
                            Download our CSV template to ensure successful
                            upload. Be sure to attribute only one product to a
                            supplier.
                          </div>

                          <div className="bg-gray-200 self-stretch flex relative cursor-pointer flex-col justify-center items-center mr-4 mt-4 px-16 py-12 rounded-lg max-md:max-w-full max-md:mr-2.5 max-md:px-5">
                            <input
                              type="file"
                              accept=".csv"
                              className="absolute left-0 top-0 w-full h-full opacity-0"
                            ></input>
                            <div className="items-center flex gap-3 mt-1.5 mb-1">
                              <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/90462b2605fc6d0399b50fa56cda63f7809e55747efc111afb6771457a2f2140?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                                className="aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full my-auto"
                              />
                              <div className="text-slate-500 text-sm font-bold leading-5 self-stretch grow whitespace-nowrap">
                                ADD A CSV FILE
                              </div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            disabled
                            className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 aspect-[1.625] mr-4 mt-4 px-4 py-3 self-end max-md:mr-2.5"
                          >
                            Import
                          </Button>
                        </div>
                      </form>
                      <button className="text-blue-600 absolute bottom-[80px] text-sm leading-5 underline self-stretch mt-4 max-md:max-w-full">
                        Download our CSV Template
                      </button>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="items-stretch self-stretch flex flex-col pb-12">
        <div className="items-stretch bg-gray-100 flex justify-between gap-5 px-5 py-5 max-md:max-w-full max-md:flex-wrap">
          <div className="text-slate-800 text-xs font-bold leading-4 grow max-md:max-w-full">
            Suppliers
          </div>
          <div>
            <Button
              onClick={handleSelectAllButtonClick}
              variant="outline"
              className="mr-3"
            >
              {areAllSelected() ? "Deselect All" : "Select All"}
            </Button>
            <Button
              onClick={() => {
                console.log("selected product ids : ", selectedProductIds);
              }}
              variant="outline"
              className="mr-4"
            >
              {" "}
              <Badge variant="outline" className="mr-4">
                {selectedProductIds.length}
              </Badge>
              Delete
            </Button>
            <Popover>
              <PopoverTrigger>
                {" "}
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e0a663d923aa11cad808bb8c9e5a6c4f17b083df00a83ae82feefea8d812672?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                  className="w-full aspect-square max-w-[16px]"
                />
              </PopoverTrigger>
              <PopoverContent>
                <ul className="justify-center p-3 text-base leading-5 text-gray-700 bg-white rounded max-w-[200px]">
                  <li className="mb-4">Add new suppliers via csv</li>
                  <li className="mb-4">
                    <Link
                      href={`/supply-chain/supplier?reportingId=${currentTab}`}
                      className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap"
                    >
                      Manually add a supplier
                    </Link>
                  </li>
                  <li className="mb-4"> Download CSV</li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="items-stretch bg-white flex w-full flex-col pb-12 max-md:max-w-full max-md:mb-10">
          <div className="items-stretch border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5 pr-4 pl-4 py-2.5 border-b border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5">
            <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5 self-stretch grow whitespace-nowrap">
              <input
                type="checkbox"
                checked={areAllSelected()}
                onChange={handleSelectAllChange}
              />
            </div>
            <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5 whitespace-nowrap">
              Supplier Name
            </div>
            <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5">
              Product Name
            </div>
            <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5">
              Product Type
            </div>
            <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5">
              Product Level Contribution
            </div>
            <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5 grow whitespace-nowrap">
              Last Updated
            </div>
          </div>
          {/* supplier list start */}
          {supplierProducts &&
            supplierProducts.length > 0 &&
            supplierProducts.map((product: any, index: number) => (
              <div className="items-stretch border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5 pr-4 pl-4 py-2.5 border-b border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5">
                <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm leading-5 self-stretch grow whitespace-nowrap">
                  <input
                    type="checkbox"
                    name="selectedProduct"
                    value={product?.id}
                    checked={selectedProductIds.includes(product?.id)}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm leading-5 whitespace-nowrap">
                  {product?.supplier?.name}
                </div>
                <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm leading-5">
                  {product?.name}
                </div>
                <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm leading-5">
                  {product?.type}
                </div>
                <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm leading-5">
                  {product?.scope_3_contribution}
                </div>
                <div className="overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm leading-5 grow whitespace-nowrap">
                  {convertDateToString(product?.updated_at)}
                </div>
              </div>
            ))}

          {/* supplier list end */}
          <div className="justify-center items-stretch flex gap-0 mb-12 px-5 max-md:max-w-full max-md:flex-wrap max-md:mb-10">
            <div className="items-center flex-1 border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-2 px-4 py-2.5 border-b border-solid">
              <Link
                href={`/supply-chain/supplier?reportingId=${currentTab}`}
                className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap"
              >
                + New Supplier
              </Link>
            </div>
            <div className="items-center flex-1 border-b-[color:var(--Gray-300,#D1D5DB)] flex w-[235px] shrink-0 h-10 flex-col border-b border-solid" />
            <div className="items-center flex-1  border-b-[color:var(--Gray-300,#D1D5DB)] flex w-[135px] shrink-0 h-10 flex-col border-b border-solid" />
            <div className="items-center flex-1 border-b-[color:var(--Gray-300,#D1D5DB)] flex w-[173px] shrink-0 h-10 flex-col border-b border-solid" />
            <div className="items-center flex-1 border-b-[color:var(--Gray-300,#D1D5DB)] flex w-56 shrink-0 h-10 flex-col border-b border-solid" />
          </div>
        </div>
      </div>
      {/* <AddSupplierManualy /> */}
    </div>
  );
};

export default Page;
