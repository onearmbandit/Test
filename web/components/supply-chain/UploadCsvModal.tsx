'use cliemt';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from '@/components/ui/dialog';
import React, { useRef, useState } from 'react';
import { Button } from '../ui/button';
import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { downloadCsvTemplate } from '@/services/supply.chain';
import download from 'downloadjs';
// import { DialogPortal } from '@radix-ui/react-dialog';
const UploadCsvModal = ({
  periodId,
  open,
  setOpen,
}: {
  periodId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [container, setContainer] = React.useState(null);
  const [uploadStatus, setUploadStatus] = useState('select');
  // const [modalStatus, setModalStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [uploadStatus, setUploadStatus] = useState("select");
  const [modalStatus, setModalStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const session = useSession();
  const token = session?.data?.token.token;
  const closePopover = () => {
    setError('');
    setSelectedFile(null);
  };
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
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  function handleChange(e: any) {
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }
  const clearFileInput = () => {
    setFileName('');
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setSelectedFile(null);
  };
  const handlePoover = () => {
    setOpen(true);
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
        setShowModal(false);
        setOpen(false);
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
        queryClient.invalidateQueries();

        toast.success('csv file uploaded Successfully.', {
          style: { color: 'green' },
        });
        setUploadStatus('done');
      })
      .catch(async (error) => {
        setError(error?.response?.data?.errors[0]?.message);
        console.log(error, 'error');
      });
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogOverlay></DialogOverlay> */}
        <DialogTrigger>
          <div
            role='button'
            onClick={() => handlePoover()}
            className='text-white text-center text-sm font-semibold leading-4 whitespace-nowrap justify-center items-stretch rounded bg-blue-600 self-center mt-6 mb-9 px-4 py-3'
          >
            Upload CSV
          </div>
        </DialogTrigger>
        <DialogContent className='z-50 max-w-[44rem] p-[60px]'>
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

              <div className='text-gray-800 text-xl font-bold leading-7 self-stretch max-md:max-w-full'>
                Import Supplier GHG Emissions
              </div>
              <form onSubmit={handleSubmit}>
                <div className='self-stretch flex w-full flex-col mt-4 mb-0 max-md:max-w-full max-md:px-5'>
                  <div className='text-gray-800 text-xl leading-7 self-stretch w-full mr-4 mt-4 max-md:max-w-full max-md:mr-2.5'>
                    Download our CSV template to ensure successful upload. Be
                    sure to attribute only one product to a supplier.
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
                onClick={() => downloadCsvMUt.mutate()}
                className='text-blue-600 absolute bottom-[80px] text-sm leading-5 underline self-stretch mt-4 max-md:max-w-full'
              >
                Download our CSV Template
              </button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {progress > 0 && (
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
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UploadCsvModal;
