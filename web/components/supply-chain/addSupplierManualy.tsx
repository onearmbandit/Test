import React from 'react';

export const AddSupplierManualy = () => {
  return (
    <div className='flex flex-col flex-start'>
      <div className='flex gap-2.5 self-stretch p-3 text-sm leading-5 text-blue-600 max-md:flex-wrap'>
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/abb35aa54041187c99ff3f2437cb0a9fd11ee183513808b35a1215039b241618?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
          className='w-6 aspect-square'
        />
        <div className='flex-auto max-md:max-w-full'>
          <span className='text-slate-500'>Supply Chain &gt;</span>{' '}
          <span className='font-bold text-blue-600'>Add Supplier</span>
        </div>
      </div>
      <div className='flex gap-5 justify-between px-[40px] self-stretch max-md:flex-wrap'>
        <div className=' text-lg font-bold leading-7 text-center text-gray-700'>
          New Supplier Entry
        </div>
        <div className='justify-center px-2 py-0.5 my-auto text-xs font-medium leading-4 text-cyan-800 whitespace-nowrap bg-cyan-50 rounded-md'>
          Reporting Period: May 2023 - Nov 2023
        </div>
      </div>
      <div className='text-sm leading-5 text- w-full px-[40px]  text-slate-800'>
        <p className='py-8'>
          Add your suppliers product carbon footprint to determine your product
          level contribution
        </p>
      </div>
      <div className='flex flex-col self-stretch py-6 mx-10 rounded border border-solid border-[color:var(--Gray-200,#E5E7EB)]'>
        <div className='flex flex-col px-6 w-full max-md:px-5 max-md:max-w-full'>
          <div className='flex gap-2.5 self-start max-md:flex-wrap max-md:max-w-full'>
            <div className='justify-center items-center px-2 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]'>
              1
            </div>
            <div className='grow text-base font-bold leading-6 text-slate-800 max-md:max-w-full'>
              Supplier Information
            </div>
          </div>
          <div className='mt-6 text-sm leading-5  text-slate-800 max-md:max-w-full'>
            Add the basic information about your supplier
          </div>
          <div className='flex gap-5 justify-between pr-20 mt-6 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5 max-md:max-w-full'>
            <div className=' my-auto font-medium text-slate-700'>
              Supplier Name
            </div>
            <div className='grow justify-center py-3.5 pr-8 pl-2 bg-gray-50 rounded-md text-slate-700 max-md:pr-5'>
              Supplier 1{' '}
            </div>
          </div>
          <div className='flex gap-5 justify-between self-stretch pr-20 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5'>
            <div className=' my-auto font-medium text-slate-700'>
              Contact Email{' '}
            </div>
            <div className='grow justify-center py-3.5 pr-8 pl-2 bg-gray-50 rounded-md text-slate-700 max-md:pr-5'>
              supplier1@supplier.com
            </div>
          </div>
          <div className='flex gap-5 justify-between pr-20 mt-6 text-xs max-md:flex-wrap max-md:pr-5 max-md:max-w-full'>
            <div className='my-auto font-medium leading-4 text-slate-700'>
              Relationship <br />
              to organization
            </div>
            <div className='flex gap-2 justify-between px-2 py-3.5 whitespace-nowrap bg-gray-50 rounded-3xl shadow-sm leading-[133%] text-slate-700'>
              <div className=''>Contracted</div>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/206eab7bca6cb98fbbbb8629ff74786078c0d2d87f623c30c96c6a792e0a8ea4?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                className='w-4 aspect-square'
              />
            </div>
          </div>
          <div className='flex gap-5 justify-between mt-6 max-md:flex-wrap max-md:max-w-full'>
            <div className='grow text-xs font-medium leading-4 text-slate-700 max-md:max-w-full'>
              Supplier Address
            </div>
            <div className='my-auto text-sm font-semibold leading-4 text-center text-blue-600'>
              Edit
            </div>
          </div>
          <div className='justify-center px-2 mt-6 text-sm font-light leading-5 bg-gray-50 rounded-3xl shadow-sm text-slate-700 max-md:max-w-full'>
            Eastern Parkway, <br />
            Floor 2, <br />
            Brooklyn, NY, 11223,
            <br />
            United States of America
          </div>
        </div>
        <div className='edit-section'>
          <div className='flex gap-5 justify-between self-stretch pb-1.5 max-md:flex-wrap'>
            <div className='flex gap-2.5 self-start px-5 text-base font-bold leading-6 text-slate-800 max-md:flex-wrap max-md:max-w-full'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/552d063641276c4b19d2c1033b6c711bc8c7c753d57dad4f762bb9bd3533b3c3?apiKey=d6fc2e9c7f6b4dada8012c83a9c1be80&'
                className='my-auto w-5 aspect-square'
              />
              <div className='grow max-md:max-w-full'>Supplier Information</div>
            </div>
            <div className='text-sm font-semibold leading-5 text-blue-600'>
              Edit
            </div>
          </div>
          <div className='text-xs font-medium leading-5 text-green-900 px-5 max-w-[515px]'>
            <span className='text-slate-500'>Supplier Name</span>:{' '}
            <span className='text-green-900'>Supplier </span>
            <br />
            <span className='text-slate-500'>Contact Email:</span>
            <span className='text-green-900'> contact@supplier.com</span>
            <br />
            <span className='text-slate-500'>
              Relationship to Organization:{' '}
            </span>
            <span className='text-green-900'>Contracted</span>
            <br />
            <span className='text-slate-500'>Supplier Address:</span>{' '}
            <span className='text-green-900'>
              Eastern Parkway, Floor 2, Brooklyn, NY, 11223, United States of
              America
            </span>
          </div>
        </div>

        <div className='justify-center self-end px-4 py-2 mt-6 mr-6 text-sm font-semibold leading-4 text-center text-blue-600 whitespace-nowrap rounded border-2 border-solid aspect-[2.03] border-[color:var(--Accent-colors-Sparkle---Active,#2C75D3)] max-md:mr-2.5'>
          Save
        </div>
      </div>
      <div className='flex flex-col self-stretch p-6 rounded border border-solid mx-10 my-8 border-[color:var(--Gray-200,#E5E7EB)] max-md:px-5'>
        <div className='flex gap-2.5 justify-between max-md:flex-wrap max-md:max-w-full'>
          <div className='justify-center items-center px-1.5 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]'>
            2
          </div>
          <div className='flex-auto text-base font-bold leading-6 text-slate-800 max-md:max-w-full'>
            Product & Product Level Contribution
          </div>
        </div>
        <div className='mt-6 text-sm leading-5 text-slate-800 max-md:max-w-full'>
          Enter the product type, product name, units created each year, and the
          functional unit associated with the product.
        </div>
      </div>
    </div>
  );
};
export default AddSupplierManualy;
