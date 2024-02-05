"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import download from "downloadjs";
import {
  addReportingPeriod,
  downloadCsvTemplate,
  getAllReportingPeriods,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import ReportingPeriodPopup from "@/components/supply-chain/reporting-period-popover";
import dayjs from "dayjs";
import AddSupplierManualy from "@/components/supply-chain/addSupplierManualy";

const Page = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [showNew, setShowNew] = useState(false);
  const session = useSession();
  const [currentTab, setCurrentTab] = useState<string | null>(null);

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

  useEffect(() => {
    if (periodsQ.isSuccess) {
      setCurrentTab(reportingPeriods[0]?.id);
    }
  }, [periodsQ.isSuccess]);
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
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a3b37dc7caf0621d0a3ddfd4c525cb8a2f3841ad00c9625467586617b68bb03?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
            alt="Reporting Period Image"
          />
          <header className="text-blue-600 text-sm font-semibold leading-5 self-stretch grow whitespace-nowrap">
            Add Reporting Period
          </header>
        </div>
      </div>
      {periodsQ.isSuccess && (
        <Tabs className="w-full" value={showNew ? "new" : currentTab!}>
          <TabsList>
            {showNew && (
              <TabsTrigger value="tab1">
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
                  onClick={() => setCurrentTab(reporting)}
                >
                  <Popover>
                    <PopoverTrigger className="text-blue-600">
                      {reporting}
                    </PopoverTrigger>
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
            <div></div>
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
                  <div className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center mt-6 mb-9 px-4 py-3">
                    Upload CSV
                  </div>
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

                          {fileName ? (
                            <div className="bg-white-200 self-stretch flex relative cursor-pointer flex-col justify-center items-start mr-4 mt-4 py-8 rounded-lg max-md:max-w-full max-md:mr-2.5 max-md:px-5">
                              <div className="flex gap-3">
                                <img
                                  loading="lazy"
                                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/76539b99402de7bbb2229a3e1b8b794f4df08d5b2955c22676d9840e4ee3a8be?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                                  className="aspect-square object-contain object-center w-16 self-stretch shrink-0"
                                />
                                <div className="text-gray-700 text-center text-base font-semibold leading-6 self-stretch grow shrink basis-auto my-auto">
                                  {fileName}
                                </div>
                                <img
                                  onClick={emptyInput}
                                  loading="lazy"
                                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0d4f4b0887ea5dba16339f6f1ded722874e86814a8d420ffd2db31638831bb1?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                                  className="aspect-square object-contain object-center w-4 self-stretch shrink-0 my-auto"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-200 self-stretch flex relative cursor-pointer flex-col justify-center items-center mr-4 mt-4 px-16 py-12 rounded-lg max-md:max-w-full max-md:mr-2.5 max-md:px-5">
                              <input
                                type="file"
                                accept=".csv"
                                onChange={handleChange}
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
                          )}

                          <Button
                            type="submit"
                            disabled={!fileName}
                            className="text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 aspect-[1.625] mr-4 mt-4 px-4 py-3 self-end max-md:mr-2.5"
                          >
                            Import
                          </Button>
                        </div>
                      </form>
                      <button
                        onClick={DownloadTemplate}
                        className="text-blue-600 absolute bottom-[80px] text-sm leading-5 underline self-stretch mt-4 max-md:max-w-full"
                      >
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
        <div className="items-stretch rounded-3xl bg-gray-100 flex justify-between gap-5 px-5 py-5 max-md:max-w-full max-md:flex-wrap">
          <div className="text-slate-800 text-xs font-bold leading-4 grow max-md:max-w-full">
            Suppliers
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e0a663d923aa11cad808bb8c9e5a6c4f17b083df00a83ae82feefea8d812672?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
            className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full"
          />
        </div>
        <div className="items-stretch bg-white flex w-full flex-col pb-12 max-md:max-w-full max-md:mb-10">
          <div className="items-stretch border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5 pr-4 pl-4 py-2.5 border-b border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5">
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
          <div className="justify-center items-stretch flex gap-0 mb-12 px-5 max-md:max-w-full max-md:flex-wrap max-md:mb-10">
            <div className="items-center flex-1 border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-2 px-4 py-2.5 border-b border-solid">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/29189ba407ce9b617e1d8bf82171c381b4863b2327accf32d1d2f807bdc438a6?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&"
                className="aspect-square object-contain object-center w-4 overflow-hidden shrink-0 max-w-full my-auto"
              />
              <div className="overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap">
                New Supplier
              </div>
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
