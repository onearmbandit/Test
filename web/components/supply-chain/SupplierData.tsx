import React from 'react';

const SupplierData = ({ periodId }: { periodId: string }) => {
  return (
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
                  7,380.72
                </div>
                <div className='text-sm leading-4 text-gray-500'>tCO2e</div>
              </div>
              <div className='justify-between px-16 pt-12 pb-6 mt-2.5 text-3xl text-teal-800 bg-white rounded-lg border border-solid shadow-sm border-[color:var(--Gray-100,#F3F4F6)] leading-[84px] max-md:px-6'>
                70%
              </div>
            </div>
          </div>
          <div className='flex flex-col ml-5 w-[67%] max-md:ml-0 max-md:w-full'>
            <div className='flex flex-col grow justify-between pt-12 pb-4 pl-8 w-full bg-white rounded-lg border border-solid shadow-sm border-[color:var(--Gray-100,#F3F4F6)] max-md:mt-2.5 max-md:max-w-full'>
              <div className='flex gap-5 justify-between mt-1.5 font-bold max-md:flex-wrap max-md:max-w-full'>
                <div className='flex-auto text-2xl leading-7 text-slate-800'>
                  Scope 3 Emissions by Product Name
                </div>
                <div className='flex-auto self-start mt-3 text-sm leading-4 text-center text-gray-500'>
                  tCO2e
                </div>
              </div>
              <div className='flex gap-5 justify-between mt-2.5 w-full text-slate-700 max-md:flex-wrap max-md:max-w-full'>
                <div className='flex flex-col my-auto text-sm leading-4 max-md:max-w-full'>
                  <div className='max-md:max-w-full'>Lays Chips</div>
                  <div className='shrink-0 mt-1.5 h-4 bg-green-200 rounded max-md:max-w-full' />
                  <div className='mt-5 max-md:max-w-full'>Men’s Swimsuits</div>
                  <div className='shrink-0 mt-2.5 h-4 bg-green-200 rounded max-md:max-w-full' />
                  <div className='mt-5 max-md:max-w-full'>Jersey</div>
                  <div className='mt-1 h-4 bg-green-200 rounded w-[125px]' />
                  <div className='mt-5 max-md:max-w-full'>Micro-tights</div>
                  <div className='mt-1.5 h-4 bg-green-200 rounded w-[27px]' />
                </div>
                <div className='flex gap-5 justify-between text-xs font-medium leading-4 text-right whitespace-nowrap'>
                  <div className='flex flex-col self-start mt-2'>
                    <div>121,799</div>
                    <div className='mt-11 max-md:mt-10'>50,799</div>
                    <div className='mt-11 max-md:mt-10'>25,567</div>
                    <div className='self-start mt-11 ml-3 max-md:mt-10 max-md:ml-2.5'>
                      5,789
                    </div>
                  </div>
                  <div className='w-px bg-gray-300 rounded-2xl h-[212px]' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierData;
