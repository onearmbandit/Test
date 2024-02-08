import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronDown, HelpCircle, Loader2, Plus } from 'lucide-react';

import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import download from 'downloadjs';
import { Button } from '../ui/button';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  downloadCsvTemplate,
  getAllEmissioScopeData,
} from '@/services/supply.chain';

const SupplierData = ({ periodId }: { periodId: string }) => {
  console.log(periodId, 'periodId');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [modalStatus, setModalStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [uploadStatus, setUploadStatus] = useState('select');
  const session = useSession();
  const token = session?.data?.token.token;

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  function handleChange(e: any) {
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }
  const handlePoover = () => {
    setModalStatus(true);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('supplierCSV', selectedFile!);
    formData.append('supplyChainReportingPeriodId', periodId);

    axios
      .post(`${BASE_URL}/api/v1/auth/supplier-csv-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: async (data) => {},
      })
      .then(async (response) => {
        console.log(response, 'response');
        await delay(1000);
        setProgress(25);
        await delay(700);
        setProgress(50);
        await delay(700);
        setProgress(75);
        await delay(1000);
        setProgress(100);
        await delay(1100);
        setProgress(0);
        setModalStatus(false);
        setUploadStatus('done');
      })
      .catch(async (error) => {
        setError(error.response.data.errors[0].message);
        console.log(error, 'error');
      });
  };
  const clearFileInput = () => {
    setFileName('');
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSelectedFile(null);
  };
  console.log(periodId, 'periodId');

  const downloadCsvMUt = useMutation({
    mutationFn: downloadCsvTemplate,
    onSuccess: (data) => {
      download(data?.data.download_url);
      toast.success('csv downloaded Successfully.', {
        style: { color: 'green' },
      });
    },
    onError: (err) => {
      alert(err);
      toast.error(err.message, { style: { color: 'red' } });
    },
  });
  const DownloadTemplate = () => {
    downloadCsvMUt.mutate();
  };
  const supplierDataQ = useQuery({
    queryKey: ['reporting-period', periodId],
    queryFn: () => getAllEmissioScopeData(periodId ? periodId : ''),
  });
  const closePopover = () => {
    setError('');
    setSelectedFile(null);
  };
  const supplierData = supplierDataQ.isSuccess ? supplierDataQ.data.data : null;
  const chartData = supplierData?.productWise;
  console.log(supplierData, 'supplierData');
  console.log(chartData, 'chartData');

  const CustomBarLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text x={x} y={y} dy={-12} dx={0} fill='#334155' textAnchor='left'>
        {value}
      </text>
    );
  };
  return (
    <div className='relative'>
      {!supplierData && (
        <div className='absolute top-0 left-0 h-full w-full z-10  flex items-center bg-white justify-center'>
          <Loader2
            height={50}
            width={50}
            className='text-blue-500 animate-spin'
          />
        </div>
      )}
      {!supplierData && (
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
            Your suppliers product-level emission data encompasses the Scope 3
            emissions directly linked to your products. To begin, upload this
            information using a CSV file or enter the data manually in the table
            below.
            <br />
          </div>
          <Dialog>
            <DialogTrigger>
              <div
                onClick={() => handlePoover()}
                className='text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center mt-6 mb-9 px-4 py-3'
              >
                Upload CSV
              </div>
            </DialogTrigger>
            {modalStatus && (
              <DialogContent className='max-w-[44rem] p-[60px]'>
                <DialogDescription>
                  <div className='bg-white flex max-w-[707px] flex-col items-end'>
                    <DialogClose asChild>
                      <Button
                        type='button'
                        variant='ghost'
                        onClick={() => closePopover()}
                      >
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
                    <form onSubmit={handleSubmit}>
                      <div className='self-stretch flex w-full flex-col mt-4 mb-0 max-md:max-w-full max-md:px-5'>
                        <div className='text-gray-800 text-xl leading-7 self-stretch w-full mr-4 mt-4 max-md:max-w-full max-md:mr-2.5'>
                          Download our CSV template to ensure successful upload.
                          Be sure to attribute only one product to a supplier.
                        </div>

                        {selectedFile ? (
                          <div className='bg-white-200 self-stretch flex relative cursor-pointer flex-col justify-center items-start mr-4 mt-4 py-8 rounded-lg max-md:max-w-full max-md:mr-2.5 max-md:px-5'>
                            <div className='flex gap-3'>
                              <img
                                loading='lazy'
                                src='https://cdn.builder.io/api/v1/image/assets/TEMP/76539b99402de7bbb2229a3e1b8b794f4df08d5b2955c22676d9840e4ee3a8be?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                                className='aspect-square object-contain object-center w-16 self-stretch shrink-0'
                              />
                              <div className='text-gray-700 text-center text-base font-semibold leading-6 self-stretch grow shrink basis-auto my-auto'>
                                {fileName}
                              </div>
                              <img
                                onClick={clearFileInput}
                                loading='lazy'
                                src='https://cdn.builder.io/api/v1/image/assets/TEMP/c0d4f4b0887ea5dba16339f6f1ded722874e86814a8d420ffd2db31638831bb1?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                                className='aspect-square object-contain object-center w-4 self-stretch shrink-0 my-auto'
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='bg-gray-200 self-stretch flex relative cursor-pointer flex-col justify-center items-center mr-4 mt-4 px-16 py-12 rounded-lg max-md:max-w-full max-md:mr-2.5 max-md:px-5'>
                            <input
                              ref={inputRef}
                              type='file'
                              accept='.csv'
                              onChange={handleChange}
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
                        )}

                        {error && (
                          <p className='text-sm leading-5 text-red-500 max-w-[562px]'>
                            {error}
                          </p>
                        )}
                        <Button
                          type='submit'
                          disabled={!fileName}
                          className='text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 aspect-[1.625] mr-4 mt-4 px-4 py-3 self-end max-md:mr-2.5'
                        >
                          Import
                        </Button>
                      </div>
                    </form>
                    <button
                      onClick={DownloadTemplate}
                      className='text-blue-600 absolute bottom-[80px] text-sm leading-5 underline self-stretch mt-4 max-md:max-w-full'
                    >
                      Download our CSV Template
                    </button>
                  </div>
                </DialogDescription>
              </DialogContent>
            )}
          </Dialog>
          {progress && (
            <Dialog defaultOpen={true}>
              <DialogTrigger></DialogTrigger>
              <DialogContent className='max-w-[707px]'>
                <div className='flex flex-col px-16 py-12 bg-white  max-md:px-5'>
                  <div className='mt-3.5 text-xl font-bold leading-7 text-center text-gray-800 max-md:max-w-full'>
                    Processing your data{' '}
                  </div>
                  <div className='mt-4 text-xl text-center leading-7 text-gray-800 max-md:max-w-full'>
                    We’re uploading your data. It will only take a few moments.
                  </div>
                  <div className='flex flex-col justify-center items-start mt-7 bg-green-100 rounded-3xl max-md:pr-5 max-md:max-w-full'>
                    <div
                      className='max-w-full h-8 bg-teal-800 rounded-3xl'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {/* <Progress
                        className='w-0'
                        value={progress}
                        style={{ width: `${progress}%` }}
                      /> */}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      <div className='flex flex-col justify-center self-stretch px-14 py-12 bg-white rounded-lg border border-solid border-[color:var(--Gray-50,#F9FAFB)] max-md:px-5'>
        <div className='max-md:max-w-full'>
          <div className='flex gap-5 max-md:flex-col max-md:gap-0 max-md:'>
            <div className='flex flex-col w-[33%] max-md:ml-0 max-md:w-full'>
              <div className='flex flex-col grow font-bold text-center whitespace-nowrap max-md:mt-2.5'>
                <div className='flex flex-col items-center px-11 py-7 bg-white rounded-lg border border-solid shadow-sm border-[color:var(--Gray-100,#F3F4F6)] max-md:px-5'>
                  <div className='self-stretch text-base leading-4 text-slate-800'>
                    Total Product Level Emissions
                  </div>
                  <div className='mt-1.5 text-4xl text-teal-800 leading-[84px]'>
                    {supplierData?.totalProductLevelEmission}
                  </div>
                  <div className='text-sm leading-4 text-gray-500'>tCO2e</div>
                </div>
                <div className='flex flex-col items-center px-11 mt-3 py-7 bg-white rounded-lg border border-solid shadow-sm border-[color:var(--Gray-100,#F3F4F6)] max-md:px-5'>
                  <div className='self-stretch text-base leading-4 text-slate-800'>
                    % of missing Product Carbon Footprint
                  </div>
                  <div className='mt-1.5 text-4xl text-teal-800 leading-[84px]'>
                    {supplierData?.missingCarbonFootPrint}
                  </div>
                </div>
              </div>
            </div>
            {chartData?.length > 0 && (
              <div className='flex flex-col ml-5 w-[67%] max-md:ml-0 max-md:w-full'>
                <div className='h-[342px] overflow-scroll flex flex-col grow justify-between pt-12 pb-4 pl-8 w-full bg-white rounded-lg border border-solid shadow-sm border-[color:var(--Gray-100,#F3F4F6)] max-md:mt-2.5 max-md:max-w-full'>
                  <div className='flex gap-5 justify-between mt-1.5 font-bold max-md:flex-wrap max-md:max-w-full border-b-2 pb-4 border-[#E5E5EF)]'>
                    <div className='flex-auto text-2xl leading-7 text-slate-800 '>
                      Scope 3 Emissions by Product Name
                    </div>
                    <div className='flex-auto self-start mt-3 text-sm leading-4 text-center text-gray-500'>
                      tCO2e
                    </div>
                  </div>
                  <div className='overflow-auto h-full'>
                    {/* <div className='h-full'> */}
                    <ResponsiveContainer className='w-full h-full'>
                      <ComposedChart
                        layout='vertical'
                        width={500}
                        height={500}
                        data={chartData}
                        barGap={20}
                        barCategoryGap='20%'
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 0,
                        }}
                      >
                        <XAxis
                          hide={true}
                          type='number'
                          domain={['auto', 'auto']}
                        />
                        <YAxis
                          dataKey=''
                          hide={true}
                          type='category'
                          scale='band'
                          padding={{ top: 0, bottom: 0 }}
                        />
                        {/* <Tooltip /> */}
                        {/* <Legend /> */}
                        <Bar
                          dataKey='scope_3_contribution'
                          label={{ position: 'right' }}
                          barSize={20}
                          radius={4}
                          fill='#BBF7D0'
                        >
                          <LabelList
                            dataKey='name'
                            position='top'
                            content={<CustomBarLabel />}
                          />
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierData;
