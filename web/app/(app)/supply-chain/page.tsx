'use client';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
import { Badge } from '@/components/ui/badge';

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
import { authOptions, convertDateToString } from '@/lib/utils';
import { exportSupplierDataCsv, getUser } from '@/services/user.api';
import UploadCsvModal from '@/components/supply-chain/UploadCsvModal';
import { getServerSession } from 'next-auth';

const Page = () => {
  const queryClient = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const session = useSession();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [showCsvUploadModal, setShowCsvUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('select');
  const [selectedProductIds, setSelectedProductIds] = useState<any>([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const organizationId = session?.data?.user.organizations[0].id!;

  const periodsQ = useQuery({
    queryKey: ['reporting-periods', organizationId],
    queryFn: () => getAllReportingPeriods(organizationId),
  });
  const reportingPeriods = periodsQ.isSuccess ? periodsQ.data.data : [];
  // console.log(session.data? session.data.user.organizations[0].id:"", 'session.data');
  console.log(reportingPeriods, 'reportingPeriods');
  const { mutate, isPending } = useMutation({
    mutationFn: importFile,
    onSuccess: (data) => {},
    onError: (err) => {
      toast.error(err.message, { style: { color: 'red' } });
    },
  });

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

  const deleteProductsMut = useMutation({
    mutationFn: deleteMultipleSupplierProducts,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries();
      setSelectedProductIds([]);
      toast.success('Selected products deleted successfully.', {
        style: { color: 'green' },
      });
    },
    onError: (err: any) => {
      toast.error(err.message, { style: { color: 'red' } });
    },
  });
  useEffect(() => {
    if (periodsQ.isSuccess) {
      setCurrentTab(reportingPeriods[0]?.id);
    }
  }, [periodsQ.isSuccess]);

  const supplierProductsQ = useQuery({
    queryKey: ['supplier-products', currentTab],
    queryFn: () => getAllSuppliersByPeriodId(currentTab!),
  });
  const supplierProducts = supplierProductsQ.isSuccess
    ? supplierProductsQ.data.data
    : [];

  const userQ = useQuery({
    queryKey: ['user-data'],
    queryFn: () => getUser(),
  });
  const user = userQ.isSuccess ? userQ.data.data : null;

  const downloadSuppliersCsvMut = useMutation({
    mutationKey: ['supplier-data-csv'],
    mutationFn: exportSuppliersDataCsv,
    onSuccess: (data: any) => {
      console.log(data, 'data');
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      // Create a Blob from the response data
      if (data) {
        // Extract the filename from the response
        const fileName = data.fileName || 'suppliers.csv';

        // Decode the base64-encoded CSV data
        const csvData = atob(data.csv);

        // Create a Blob from the decoded CSV data
        const blob = new Blob([csvData], { type: 'application/csv' });

        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        // Append the link to the document and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link element
        document.body.removeChild(link);

        toast.success('Data exported successfully');
      }
      toast.success('Data exported successfully');
    },
    onError: (error) => {
      console.log(error, 'error');
      toast.error('Error exporting data:' + error.message);
    },
  });

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

                {reportingPeriods.map((item: any, i: number) => {
                  const reporting = `${dayjs(item.reporting_period_from).format(
                    'MMM YYYY'
                  )} - ${dayjs(item.reporting_period_to).format('MMM YYYY')}`;
                  return (
                    <TabsTrigger
                      key={i}
                      value={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setSelectedProductIds([]);
                      }}
                    >
                      <Popover>
                        <PopoverTrigger className=''>
                          {reporting}
                        </PopoverTrigger>
                        <PopoverContent
                          align='start'
                          className='w-full left-0 p-0 -ml-4'
                        >
                          <ReportingPeriodPopup
                            setNew={setShowNew}
                            period={item}
                          />
                        </PopoverContent>
                      </Popover>
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
              </TabsContent>
            </Tabs>
          )}
        </div>
        <div className='items-stretch self-stretch flex flex-col pb-12 mt-8'>
          <div className='items-center bg-gray-100 flex justify-between rounded-t-md  gap-5 px-5 py-5 max-md:max-w-full max-md:flex-wrap'>
            <div className='text-slate-800 text-xs font-bold leading-4 grow max-md:max-w-full'>
              Suppliers
            </div>
            <div>
              <Button
                onClick={handleSelectAllButtonClick}
                variant='outline'
                className='mr-3'
              >
                {areAllSelected() ? 'Deselect All' : 'Select All'}
              </Button>
              <Dialog>
                <DialogTrigger>
                  <Button variant='outline' className='mr-4'>
                    {' '}
                    <Badge
                      variant='outline'
                      className='justify-center items-center px-1.5 h-5 mr-4 text-xs font-semibold leading-4 text-blue-800 whitespace-nowrap bg-blue-200 rounded-[100px]'
                    >
                      {selectedProductIds.length}
                    </Badge>
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className='p-6 space-y-5'>
                  <p className='text'>
                    Are you sure you want to delete these entries? This action
                    cannot be undone.
                  </p>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      variant={'outline'}
                      className='font-semibold leading-4 text-center hover:text-blue-600 text-blue-600 rounded border-2 border-solid border-[color:var(--Blue-600,#2B73D0)]'
                    >
                      No, don&apos;t erase my entry
                    </Button>
                  </DialogClose>
                  <DialogClose>
                    <Button
                      type='button'
                      variant={'outline'}
                      onClick={() => {
                        deleteProductsMut.mutate(selectedProductIds);
                      }}
                      className='border-2 border-red-500 w-full font-semibold text-red-500 hover:bg-red-50 hover:text-red-600'
                    >
                      Yes, continue
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>

              <Popover>
                <PopoverTrigger>
                  {' '}
                  <img
                    loading='lazy'
                    src='https://cdn.builder.io/api/v1/image/assets/TEMP/2e0a663d923aa11cad808bb8c9e5a6c4f17b083df00a83ae82feefea8d812672?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                    className='w-full aspect-square max-w-[16px]'
                  />
                </PopoverTrigger>
                <PopoverContent className='w-[240px] mr-3 mt-3 leff-auto right-0'>
                  <ul className='justify-center text-base leading-5 text-gray-700 bg-white rounded '>
                    <li
                      className='mb-4 cursor-pointer'
                      onClick={() => setShowCsvUploadModal(true)}
                    >
                      Add new suppliers via csv
                    </li>

                    <li className='mb-4'>
                      <Link
                        href={`/supply-chain/supplier?reportingId=${currentTab}`}
                      >
                        Manually add a supplier
                      </Link>
                    </li>
                    <li
                      className='mb-4 cursor-pointer'
                      onClick={() =>
                        downloadSuppliersCsvMut.mutate({
                          organizationId: user?.organizations[0]?.id,
                          supplyChainReportingPeriodId: currentTab!,
                        })
                      }
                    >
                      Download CSV
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className='items-stretch bg-white flex w-full flex-col pb-12 max-md:max-w-full max-md:mb-10'>
            <div className='items-center border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5 pr-4 pl-4 py-2.5 border-b border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5'>
              <div className='flex items-center min-w-[280px] text-slate-800 text-ellipsis flex-1 text-sm font-bold leading-5 whitespace-nowrap'>
                <div className='mr-3 mt-2'>
                  <div className='inline-flex items-center'>
                    <label
                      className='relative flex items-center rounded-full cursor-pointer'
                      htmlFor='check'
                    >
                      <input
                        type='checkbox'
                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-[#2C75D3] checked:before:bg-[#2C75D3] hover:before:opacity-10"
                        checked={areAllSelected()}
                        onChange={handleSelectAllChange}
                      />
                      <span className='absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-3.5 w-3.5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          stroke='currentColor'
                          stroke-width='1'
                        >
                          <path
                            fill-rule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clip-rule='evenodd'
                          ></path>
                        </svg>
                      </span>
                    </label>
                  </div>
                </div>
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
            {supplierProducts &&
              supplierProducts.length > 0 &&
              supplierProducts.map((product: any, index: number) => (
                <div
                  key={index}
                  className='items-center bg-[#F9FAFB] border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-5  border-b border-solid max-md:max-w-full max-md:flex-wrap max-md:pr-5'
                >
                  <div className='flex items-center min-w-[280px] border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] pr-4 pl-4 py-1.5 justify-between text-slate-800 text-ellipsis truncate flex-1 text-sm leading-5 whitespace-nowrap'>
                    <div className='flex items-center max-w-[160px]'>
                      <div className='mr-2'>
                        <div className='inline-flex items-center'>
                          <label
                            className='relative flex items-center rounded-full cursor-pointer'
                            htmlFor='check'
                          >
                            <input
                              type='checkbox'
                              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:bg-[#2C75D3] checked:before:bg-[#2C75D3] hover:before:opacity-10"
                              name='selectedProduct'
                              value={product?.id}
                              checked={selectedProductIds.includes(product?.id)}
                              onChange={handleCheckboxChange}
                            />
                            <span className='absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-3.5 w-3.5'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                                stroke='currentColor'
                                stroke-width='1'
                              >
                                <path
                                  fill-rule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clip-rule='evenodd'
                                ></path>
                              </svg>
                            </span>
                          </label>
                        </div>
                      </div>
                      <p className='truncate' title={product?.supplier?.name}>
                        {product?.supplier?.name}
                      </p>
                    </div>

                    <button className='flex flex-col justify-center bg-gradient-to-b from-gray-100  hover:from-gray-200 hover:via-gray-200 hover:to-gray-300 px-2 py-2 text-xs font-semibold leading-4 text-center text-gray-500 whitespace-nowrap bg-white rounded border border-solid shadow border-[color:var(--Gray-100,#F3F4F6)] max-w-[72px]'>
                      <Link
                        href={`/supply-chain/supplier/${product?.supplier?.id}`}
                        className='flex gap-2 justify-between'
                      >
                        <ArrowUpRight size={16} className='text-slate-600' />
                        <p className='link'>VIEW</p>
                      </Link>
                    </button>
                  </div>
                  <div className='overflow-hidden border-r whitespace-nowrap border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800  flex-1 text-sm leading-5'>
                    <p
                      className='pr-4 pl-4 py-2.5 text-ellipsis truncate'
                      title={product?.name}
                    >
                      {product?.name}
                    </p>
                  </div>
                  <div
                    className='overflow-hidden pr-4 pl-4 whitespace-nowrap py-2.5 border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800 text-ellipsis flex-1 text-sm leading-5 truncate'
                    title={product?.type}
                  >
                    {product?.type}
                  </div>
                  <div className='overflow-hidden pr-4 whitespace-nowrap pl-4 py-2.5 border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800 text-ellipsis flex-1 truncate text-sm leading-5'>
                    {product?.scope_3_contribution}
                  </div>
                  <div className='overflow-hidden pr-4 pl-4 py-2.5 border-r border-solid border-r-[color:var(--Gray-200,#E5E7EB)] text-slate-800 text-ellipsis flex-1 text-sm leading-5 truncate grow whitespace-nowrap'>
                    {convertDateToString(product?.updated_at)}
                  </div>
                </div>
              ))}

            {/* supplier list end */}
            <div className='justify-center items-stretch flex gap-0 mb-12 px-5 max-md:max-w-full max-md:flex-wrap max-md:mb-10'>
              <div className='items-center flex-1 border-b-[color:var(--Gray-200,#E5E7EB)] flex justify-between gap-2 px-4 py-2.5 border-b border-solid'>
                <Link
                  href={`/supply-chain/supplier?reportingId=${currentTab}`}
                  className='overflow-hidden text-slate-800 text-ellipsis text-sm leading-5 self-stretch grow whitespace-nowrap'
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
      </div>
    </>
  );
};

export default Page;
