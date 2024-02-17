'use client';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowUpRight,
  ChevronDown,
  HelpCircle,
  Loader2,
  Plus,
} from 'lucide-react';
import download from 'downloadjs';

import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import {
  addReportingPeriod,
  deleteMultipleSupplierProducts,
  downloadCsvTemplate,
  exportSuppliersDataCsv,
  getAllEmissioScopeData,
  getAllReportingPeriods,
  getAllSuppliersByPeriodId,
  importFile,
} from '@/services/supply.chain';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSession } from 'next-auth/react';
import ReportingPeriodPopup from '@/components/supply-chain/reporting-period-popover';
import dayjs from 'dayjs';
import SupplierData from '@/components/supply-chain/SupplierData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { exportSupplierDataCsv, getUser } from '@/services/user.api';
import UploadCsvModal from '@/components/supply-chain/UploadCsvModal';
import { getServerSession } from 'next-auth';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card';

const Page = () => {
  const queryClient = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const session = useSession();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [showCsvUploadModal, setShowCsvUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('select');
  const [selectedProductIds, setSelectedProductIds] = useState<any>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const userQ = useQuery({
    queryKey: ['user-data'],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data.data : null;
  const organizationId = session?.data?.user.organizations[0].id!;

  const periodsQ = useQuery({
    queryKey: ['reporting-periods', organizationId],
    queryFn: () => getAllReportingPeriods(organizationId),
  });
  const reportingPeriods = periodsQ.isSuccess ? periodsQ.data.data : [];

  useEffect(() => {
    if (periodsQ.isSuccess) {
      console.log(reportingPeriods, 'reportingPeriods');
      if (
        !reportingPeriods ||
        !reportingPeriods.length ||
        !reportingPeriods[0]?.id
      ) {
        setShowNew(true);
      }
      setCurrentTab(reportingPeriods[0]?.id);
    }
  }, [periodsQ.isSuccess, reportingPeriods]);
  console.log(currentTab, 'curenttab');
  return (
    <>
      {showCsvUploadModal && (
        <UploadCsvModal
          open={showCsvUploadModal}
          setOpen={setShowCsvUploadModal}
          periodId={currentTab!}
        ></UploadCsvModal>
      )}
      <div className='w-full shadow bg-gray-50 flex flex-col pl-6 pr-6 pt-5 pb-12 max-md:px-5'>
        <header className='justify-between items-center self-stretch flex gap-5 py-2 max-md:flex-wrap max-md:px-5'>
          <div className='overflow-hidden text-slate-800 text-ellipsis text-base font-semibold leading-6 my-auto'>
            {user?.organizations[0]?.company_name}
          </div>
          <div className='justify-center self-stretch flex flex-col pl-16 py-6 items-end max-md:max-w-full max-md:pl-5'>
            <div className='text-gray-900 text-xs font-medium leading-4 whitespace-nowrap justify-center items-stretch bg-gray-50 p-2 rounded-md'>
              NAICS: {user?.organizations[0]?.naics_code}
            </div>
          </div>
        </header>
        <div className='w-full flex justify-end items-center'>
          <div
            className='rounded flex gap-1.5 px-3.5 py-1.5 cursor-pointer'
            onClick={() => setShowNew(true)}
          >
            <header className='text-blue-600 text-sm font-semibold leading-5 self-stretch grow whitespace-nowrap'>
              + Add Reporting Period
            </header>
          </div>
        </div>
        <div className='relative'>
          {periodsQ.isLoading && (
            <Loader2 className='text-blue-500 animate-spin' />
          )}
          {periodsQ.isSuccess && (
            <Tabs
              className='w-full'
              value={showNew ? 'new' : currentTab!}
              onValueChange={setCurrentTab}
            >
              <TabsList>
                {showNew && (
                  <TabsTrigger value='new'>
                    <Popover defaultOpen={true}>
                      <PopoverTrigger> Add Reporting Period</PopoverTrigger>
                      <PopoverContent
                        align='start'
                        className='w-full left-0 p-0 -ml-4'
                      >
                        <ReportingPeriodPopup setNew={setShowNew} />
                      </PopoverContent>
                    </Popover>
                  </TabsTrigger>
                )}

                {reportingPeriods?.map((item: any, i: number) => {
                  const reporting = `${dayjs(item.reporting_period_from).format(
                    'MMM YYYY'
                  )} - ${dayjs(item.reporting_period_to).format('MMM YYYY')}`;
                  return (
                    <TabsTrigger
                      key={i}
                      value={item.id}
                      onClick={() => {
                        //   setCurrentTab(item.id);
                        setSelectedProductIds([]);
                      }}
                    >
                      <HoverCard key={i}>
                        <HoverCardTrigger asChild>
                          <p>{reporting}</p>
                        </HoverCardTrigger>
                        <HoverCardContent
                          align='start'
                          className='w-full left-0 p-0 -ml-4 z-50'
                        >
                          <ReportingPeriodPopup
                            setNew={setShowNew}
                            period={item}
                          />
                        </HoverCardContent>
                      </HoverCard>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value={currentTab!} className='relative'>
                <SupplierData periodId={currentTab!}></SupplierData>
              </TabsContent>

              <TabsContent value='new'>
                <div className='justify-center items-center self-stretch border border-[color:var(--Gray-50,#F9FAFB)] bg-white flex flex-col px-20 py-12 rounded-lg border-solid max-md:px-5'>
                  <img
                    loading='lazy'
                    src='https://cdn.builder.io/api/v1/image/assets/TEMP/9125c29d6e22fd51a2f1e9dcb27da44ac69b93ebcdb1009043a3b8178d6d05e3?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                    className='aspect-[1.17] object-contain object-center w-[54px] overflow-hidden self-center max-w-full mt-9'
                  />
                  <div className='text-slate-700 text-3xl font-semibold leading-9 self-center mt-3 max-md:max-w-full'>
                    Upload supplier product level emissions data
                  </div>
                  <div className='text-slate-700 text-center text-lg font-light leading-7 self-stretch w-full mt-6 max-md:max-w-full max-md:mr-2'>
                    Your suppliers product-level emission data encompasses the
                    Scope 3 emissions directly linked to your products. To
                    begin, upload this information using a CSV file or enter the
                    data manually in the table below.
                    <br />
                  </div>
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        disabled
                        className='text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center mt-6 mb-9 px-4 py-3'
                      >
                        Upload CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-[44rem] p-[60px]'>
                      <DialogDescription>
                        <div className='bg-white flex max-w-[707px] flex-col items-end'>
                          <DialogClose asChild>
                            <Button type='button' variant='ghost'>
                              <img
                                loading='lazy'
                                src='https://cdn.builder.io/api/v1/image/assets/TEMP/d846c09ab3f4187b63077673a631850dbed6d5d8a2e8740d3dfc3f933dba7c58?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                                className='aspect-square object-contain object-center w-6 overflow-hidden max-w-full max-md:mr-2.5'
                              />
                            </Button>
                          </DialogClose>

                          <div className='text-gray-800 text-center text-xl font-bold leading-7 self-stretch max-md:max-w-full'>
                            Import Supplier GHG Emissions
                          </div>
                          <form>
                            <div className='self-stretch flex w-full flex-col mt-4 mb-0 max-md:max-w-full max-md:px-5'>
                              <div className='text-gray-800 text-xl leading-7 self-stretch w-full mr-4 mt-4 max-md:max-w-full max-md:mr-2.5'>
                                Download our CSV template to ensure successful
                                upload. Be sure to attribute only one product to
                                a supplier.
                              </div>

                              <div className='bg-gray-200 self-stretch flex relative cursor-pointer flex-col justify-center items-center mr-4 mt-4 px-16 py-12 rounded-lg max-md:max-w-full max-md:mr-2.5 max-md:px-5'>
                                <input
                                  type='file'
                                  accept='.csv'
                                  className='absolute left-0 top-0 w-full h-full opacity-0'
                                ></input>
                                <div className='items-center flex gap-3 mt-1.5 mb-1'>
                                  <img
                                    loading='lazy'
                                    src='https://cdn.builder.io/api/v1/image/assets/TEMP/90462b2605fc6d0399b50fa56cda63f7809e55747efc111afb6771457a2f2140?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                                    className='aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full my-auto'
                                  />
                                  <div className='text-slate-500 text-sm font-bold leading-5 self-stretch grow whitespace-nowrap'>
                                    ADD A CSV FILE
                                  </div>
                                </div>
                              </div>

                              <Button
                                type='submit'
                                disabled
                                className='text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 aspect-[1.625] mr-4 mt-4 px-4 py-3 self-end max-md:mr-2.5'
                              >
                                Import
                              </Button>
                            </div>
                          </form>
                          <button className='text-blue-600 absolute bottom-[80px] text-sm leading-5 underline self-stretch mt-4 max-md:max-w-full'>
                            Download our CSV Template
                          </button>
                        </div>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className='items-stretch self-stretch flex flex-col pb-12 mt-8'>
                  <div className='items-center bg-gray-100 flex justify-between rounded-t-md  gap-5 px-5 py-5 max-md:max-w-full max-md:flex-wrap'>
                    <div className='text-slate-800 text-xs font-bold leading-4 grow max-md:max-w-full'>
                      Suppliers
                    </div>
                    <div>
                      <img
                        loading='lazy'
                        src='https://cdn.builder.io/api/v1/image/assets/TEMP/2e0a663d923aa11cad808bb8c9e5a6c4f17b083df00a83ae82feefea8d812672?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                        className='w-full aspect-square max-w-[16px]'
                      />
                    </div>
                  </div>

                  <div className='items-stretch bg-white flex w-full flex-col pb-12 max-md:max-w-full max-md:mb-10'>
                    <div className='items-center border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5 pr-4 pl-4 py-2.5 border-b border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5'>
                      <div className='flex items-center min-w-[280px] text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5 whitespace-nowrap'>
                        <div className='mr-3 mt-2'></div>
                        Supplier Name
                      </div>
                      <div className='overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5'>
                        Product Name
                      </div>
                      <div className='overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5'>
                        Product Type
                      </div>
                      <div className='overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5'>
                        Product Level Contribution
                      </div>
                      <div className='overflow-hidden text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5 grow whitespace-nowrap'>
                        Last Updated
                      </div>
                    </div>
                    {/* supplier list start */}

                    <div className='items-center bg-[#F9FAFB] border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5  border-b border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5'>
                      <div className='flex items-center min-w-[280px] border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] pr-4 pl-4 py-1.5 justify-between text-slate-800 text-ellipsis truncate flex-1 text-sm leading-5 whitespace-nowrap'>
                        <div className='flex items-center max-w-[160px]'>
                          <div className='mr-2'></div>
                          <p className='truncate'></p>
                        </div>
                      </div>
                      <div className='overflow-hidden border-r whitespace-nowrap border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800  flex-1 text-sm leading-5'>
                        <p className='pr-4 pl-4 py-2.5 text-ellipsis truncate'></p>
                      </div>
                      <div className='overflow-hidden pr-4 pl-4 whitespace-nowrap py-2.5 border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800 text-ellipsis flex-1 text-sm leading-5 truncate'></div>
                      <div className='overflow-hidden pr-4 whitespace-nowrap pl-4 py-2.5 border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800 text-ellipsis flex-1 truncate text-sm leading-5'></div>
                      <div className='overflow-hidden pr-4 pl-4 py-2.5 border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800 text-ellipsis flex-1 text-sm leading-5 truncate grow whitespace-nowrap'></div>
                    </div>

                    {/* supplier list end */}
                    <div className='justify-center items-stretch flex gap-0 mb-12 px-5 max-md:max-w-full max-md:flex-wrap max-md:mb-10'>
                      <div className='items-center flex-1 border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-2 px-4 py-2.5 border-b border-solid'>
                        <Link
                          href=''
                          className='cursor-not-allowed opacity-50 overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap'
                        >
                          + New Supplier
                        </Link>
                      </div>
                      <div className='items-center flex-1 border-b-[color:var(--Gray-300,#D1D5DB)] flex w-[235px] shrink-0 h-10 flex-col border-b border-solid' />
                      <div className='items-center flex-1  border-b-[color:var(--Gray-300,#D1D5DB)] flex w-[135px] shrink-0 h-10 flex-col border-b border-solid' />
                      <div className='items-center flex-1 border-b-[color:var(--Gray-300,#D1D5DB)] flex w-[173px] shrink-0 h-10 flex-col border-b border-solid' />
                      <div className='items-center flex-1 border-b-[color:var(--Gray-300,#D1D5DB)] flex w-56 shrink-0 h-10 flex-col border-b border-solid' />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
