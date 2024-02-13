import React, { useEffect, useRef, useState } from 'react';

import { ChevronDown, HelpCircle, Loader2, Plus } from 'lucide-react';

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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getAllEmissioScopeData } from '@/services/supply.chain';
import UploadCsvModal from './UploadCsvModal';

const SupplierData = ({ periodId }: { periodId: string }) => {
  console.log(periodId, 'periodId');

  const [modalStatus, setModalStatus] = useState(false);
  const [data, setData] = useState();
  const session = useSession();
  const token = session?.data?.token.token;
  const [showCsvUploadModal, setShowCsvUploadModal] = useState(false);

  console.log(periodId, 'periodId');

  const supplierDataQ = useQuery({
    queryKey: ['reporting-period', periodId],
    queryFn: () => getAllEmissioScopeData(periodId ? periodId : ''),
  });

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
  console.log('supplier data: ', supplierData);
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
      {supplierData?.productWise?.length < 1 &&
      supplierData.totalProductLevelEmission < 1 &&
      supplierData.missingCarbonFootPrint < 1 ? (
        <div className='justify-center items-center self-stretch border border-[color:var(--Gray-50,#F9FAFB)] bg-white flex flex-col px-20 py-16 rounded-lg border-solid max-md:px-5'>
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
          <UploadCsvModal
            open={showCsvUploadModal}
            setOpen={setShowCsvUploadModal}
            periodId={periodId}
          ></UploadCsvModal>
        </div>
      ) : (
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
                  <div className='h-[342px] flex flex-col grow justify-between pt-12 pb-4 pl-8 w-full bg-white rounded-lg border border-solid shadow-sm border-[color:var(--Gray-100,#F3F4F6)] max-md:mt-2.5 max-md:max-w-full'>
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
      )}
    </div>
  );
};

export default SupplierData;
