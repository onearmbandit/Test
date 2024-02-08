'use client';
import { ChevronLeft, X } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import AutocompleteInput from '../Autocomplete';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';

import { useFormik } from 'formik';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import {
  addSupplier,
  createSupplierProduct,
  getProductNamesBySupplierId,
  getProductTypesBySupplierId,
  getReportingPeriodById,
  updateSupplier,
} from '@/services/supply.chain';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import CreatableSelect from 'react-select/creatable';

import { cn, converPeriodToString, formatReportingPeriod } from '@/lib/utils';
import { report } from 'process';
import { ChevronDown, HelpCircle, Loader2, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import _, { set } from 'lodash';
import { Button } from '../ui/button';

export const AddSupplierManualy = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportingId = searchParams.get('reportingId');

  const [editSupplier, setEditSupplier] = useState(false);
  const [supplier, setSupplier] = useState<any>(null);
  const [productList, setProductList] = useState<any>([
    {
      name: '',
      type: '',
      quantity: '',
      functionalUnit: '',
      scope_3Contribution: '',
    },
  ]);
  const [createableValue, setCreatableValue] = useState<any>('');

  const reportingPeriodQ = useQuery({
    queryKey: ['reporting-period', reportingId],
    queryFn: () => getReportingPeriodById(reportingId ? reportingId : ''),
  });

  const reportingPeriod = reportingPeriodQ.isSuccess
    ? reportingPeriodQ.data.data
    : null;

  // const productNamesQ = useQuery({
  //   queryKey: ["product-names"],
  //   queryFn: () => getProductNamesBySupplierId(supplier?.data?.id),
  // });

  // const productNames = productNamesQ.isSuccess ? productNamesQ.data.data : [];

  // const productTypesQ = useQuery({
  //   queryKey: ["product-types"],
  //   queryFn: () => getProductTypesBySupplierId(supplier?.data?.id),
  // });

  // const productTypes = productTypesQ.isSuccess ? productTypesQ.data.data : [];

  const relationShips = ['OWNED', 'CONTRACTED'];

  const validation = z.object({
    name: z.string(),
    email: z.string().email(),
    organizationRelationship: z.string(),
    address: z.string(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addSupplier,
    onSuccess: (data) => {
      console.log('supplier created : ', data);

      setSupplier(data);

      setValues({
        ...data.data,
        organizationRelationship: data.data.organization_relationship,
      });
      toast.success('New Supplier Added', { style: { color: 'green' } });
      setEditSupplier(true);
      // router.push("/supply-chain");
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message, { style: { color: 'red' } });
    },
  });

  const { mutate: editSupplierMut } = useMutation({
    mutationFn: updateSupplier,
    onSuccess: (data) => {
      console.log('supplier updated : ', data);

      setSupplier(data);
      setValues(data.data);
      toast.success('Supplier Updated', { style: { color: 'green' } });
      setEditSupplier(true);
      // router.push("/supply-chain");
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message, { style: { color: 'red' } });
    },
  });

  const { mutate: addSupplierProductsMut } = useMutation({
    mutationFn: createSupplierProduct,
    onSuccess: (data) => {
      console.log('supplier products created: ', data);

      toast.success('Supplier Created', { style: { color: 'green' } });

      router.push('/');
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err.message, { style: { color: 'red' } });
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
      id: supplier?.data?.id ? supplier.data.id : '',
      supplyChainReportingPeriodId: reportingId,
      name: '',
      email: '',
      organizationRelationship: '',
      address: '',
    },
    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(validation),
    onSubmit: (data) => {
      console.log('add supplier : ', data);
      data = { ...data, supplyChainReportingPeriodId: reportingId };
      if (supplier?.data?.id) {
        editSupplierMut(data);
      } else {
        mutate(data);
      }
    },
  });

  const handleCreate = (inputValue: string, i: number) => {
    const newOption = {
      name: inputValue,
      quantity: '',
      type: '',
      functionalUnit: '',
      scope_3Contribution: '',
    };
    const newCopy = _.cloneDeep(productList);
    newCopy[i].name = inputValue;
    setProductList(newCopy);
    setCreatableValue(newOption);
  };

  console.log(errors);
  return (
    <div className='flex flex-col flex-start p-6 w-full'>
      <header className='flex gap-2.5 self-stretch p-3 text-sm items-center leading-5 text-blue-600 max-md:flex-wrap'>
        <ChevronLeft size={24} className='text-slate-500' />
        <div className='flex-auto max-md:max-w-full'>
          <p className='text-slate-500'>
            Supply Chain &gt;
            <span className='font-bold text-blue-600 ml-2'>Add Supplier</span>
          </p>
        </div>
      </header>

      <div className='flex gap-5 justify-between px-[40px] self-stretch max-md:flex-wrap'>
        <div className='text-lg mt-2 font-bold leading-7 text-center text-gray-700'>
          New Supplier Entry
        </div>
        <p className='justify-center px-2 py-0.5 my-auto text-xs font-medium leading-4 text-cyan-800 whitespace-nowrap bg-cyan-50 rounded-md'>
          Reporting Period:
          <span>
            {reportingPeriod && converPeriodToString(reportingPeriod)}
          </span>
        </p>
      </div>
      <div className='text-sm leading-5 text- w-full px-[40px]  text-slate-800'>
        <p className='py-6'>
          Add your suppliers product carbon footprint to determine your product
          level contribution
        </p>
      </div>

      <div className='flex flex-col self-stretch py-6 mx-10 rounded border border-solid border-[color:var(--Gray-200,#E5E7EB)]'>
        <div className='flex flex-col px-6 w-full max-md:px-5 max-md:max-w-full'>
          {editSupplier ? (
            <div>
              <div className='edit-section'>
                <div className='flex gap-5 justify-between self-stretch pb-1.5 max-md:flex-wrap'>
                  <div className='flex gap-2.5 self-start px-5 mb-6 text-base font-bold leading-6 text-slate-800 max-md:flex-wrap max-md:max-w-full'>
                    <div className='flex justify-center items-center px-1.5 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]'>
                      1
                    </div>
                    <div className='grow max-md:max-w-full'>
                      Supplier Information
                    </div>
                  </div>
                  <div
                    role='button'
                    onClick={() => setEditSupplier(false)}
                    className='text-sm font-semibold leading-5 text-blue-600'
                  >
                    Edit
                  </div>
                </div>
                <div className='text-xs font-medium leading-5 text-green-900 px-5 max-w-[515px]'>
                  <p className='text-slate-500'>
                    Supplier Name:{' '}
                    <span className='text-green-900'>
                      {supplier?.data?.name}
                    </span>
                  </p>
                  <span className='text-slate-500'>Contact Email:</span>
                  <span className='text-green-900'>
                    {' '}
                    {supplier?.data?.email}
                  </span>
                  <br />
                  <span className='text-slate-500'>
                    Relationship to Organization:{' '}
                  </span>
                  <span className='text-green-900'>
                    {supplier?.data?.organization_relationship}
                  </span>
                  <br />
                  <span className='text-slate-500'>Supplier Address:</span>{' '}
                  <span className='text-green-900'>
                    {supplier?.data?.address}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className='flex gap-2.5 self-start max-md:flex-wrap max-md:max-w-full'>
                <div className='flex justify-center items-center px-1.5 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]'>
                  1
                </div>
                <div className='grow text-base font-bold leading-6 text-slate-800 max-md:max-w-full'>
                  Supplier Information
                </div>
              </div>
              <div className='mt-6 text-sm leading-5  text-slate-800 max-md:max-w-full'>
                Add the basic information about your supplier
              </div>
              <form onSubmit={handleSubmit}>
                <div className='flex gap-5 pr-20 mt-6 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5 max-md:max-w-full'>
                  <div className=' my-auto font-medium text-slate-700'>
                    Supplier Name
                  </div>
                  <Input
                    name='name'
                    value={values.name}
                    onChange={handleChange}
                    className={cn(
                      'grow justify-center bg-gray-50 text-slate-700 max-md:pr-5 max-w-[337px]',
                      errors?.name && 'border border-red-500'
                    )}
                  />
                </div>

                <div className='flex gap-5 self-stretch pr-20 mt-6 text-xs leading-4 whitespace-nowrap max-md:flex-wrap max-md:pr-5'>
                  <div className=' my-auto font-medium text-slate-700'>
                    Contact Email{' '}
                  </div>
                  <Input
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                    className={cn(
                      'grow justify-center py-3.5 pr-8 pl-2 bg-gray-50 max-w-[337px] rounded-md text-slate-700 max-md:pr-5',
                      errors?.email && 'border border-red-500'
                    )}
                  />
                </div>

                <div className='flex gap-5  pr-20 mt-6 text-xs max-md:flex-wrap max-md:pr-5 max-md:max-w-full'>
                  <div className='my-auto font-medium leading-4 text-slate-700'>
                    Relationship <br />
                    to organization
                  </div>
                  <div className='flex gap-2 justify-between whitespace-nowrap  text-slate-700 h-[44px]'>
                    <Select
                      value={values.organizationRelationship}
                      onValueChange={(e) => {
                        console.log('value changed : ', e);
                        setFieldValue('organizationRelationship', e);
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          'text-slate-500 text-sm font-light leading-5  bg-gray-50 py-6 rounded-md max-md:max-w-full',
                          errors?.organizationRelationship && ' border-red-500'
                        )}
                      >
                        <SelectValue placeholder='Select relation to organization' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className='text-sm'>
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

                <div className='flex gap-5 justify-between items-center mt-6 max-md:flex-wrap max-md:max-w-full mb-6'>
                  <div className='grow text-xs font-medium leading-4 text-slate-700 max-md:max-w-full'>
                    Supplier Address
                  </div>
                  <div className='my-auto text-sm font-semibold leading-4 text-center text-blue-600'>
                    Edit
                  </div>
                </div>
                <div className='max-w-[768px]'>
                  <AutocompleteInput
                    setAddress={(a: string) => {
                      /** TODO: add the autocompleted address */
                      setFieldValue('address', a);
                      console.log(a, 'address');
                      console.log('first');
                    }}
                    address={values.address}
                  />
                </div>
                <div className='flex justify-end'>
                  <Button
                    variant='outline'
                    type='submit'
                    className='justify-center self-end px-4 py-2 mt-6 text-sm font-semibold leading-4 text-center text-blue-600 whitespace-nowrap rounded border-2 border-solid aspect-[2.03] border-[color:var(--Accent-colors-Sparkle---Active,#2C75D3)] max-md:mr-2.5'
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-col self-stretch p-6 rounded border mt-6 mx-10 border-solid border-[color:var(--Gray-200,#E5E7EB)] max-md:px-5'>
        <div className='flex gap-2.5 justify-between max-md:flex-wrap max-md:max-w-full'>
          <div className='flex justify-center items-center px-1.5 my-auto h-5 text-xs font-semibold leading-4 text-gray-600 whitespace-nowrap aspect-square bg-slate-200 rounded-[100px]'>
            2
          </div>
          <div className='flex-auto text-base font-bold leading-6 text-slate-800 max-md:max-w-full'>
            Product & Product Level Contribution
          </div>
        </div>
        <div className='mt-6 text-sm leading-5 text-slate-800 max-md:max-w-full'>
          Enter the product type, product name, units created each year, and the
          functional unit associated with the product. If you know the total
          Scope 3 contributions for the given quantity of each product, enter it
          here
        </div>
        <Table>
          <TableHeader className='border-b'>
            <TableHead className='text-xs pl-0 pr-4'>Product Name</TableHead>
            <TableHead className='text-xs pl-0 pr-4'>Product Type</TableHead>
            <TableHead className='text-xs pl-0 pr-4'>Quantity</TableHead>
            <TableHead className='flex gap-3 pl-0 pr-4 text-xs justify-between items-center relative'>
              <div>Functional Unit</div>
              <HelpCircle size={12}></HelpCircle>
            </TableHead>
            <TableHead className='grow whitespace-nowrap text-xs'>
              Scope 3 Contribution (kgCO2)
            </TableHead>
            <TableHead></TableHead>
          </TableHeader>
          <TableBody>
            {productList.map((item: any, i: number) => (
              <TableRow className='px-6 border-0 hover:bg-transparent'>
                <TableCell className='min-w-[10rem] pl-0 pr-4 py-3'>
                  <CreatableSelect
                    isClearable
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.name}
                    onChange={(newValue) => {
                      const newCopy = _.cloneDeep(productList);
                      newCopy[i].name = newValue.name;
                      console.log(newValue, 'new value');
                      setProductList(newCopy);
                    }}
                    onCreateOption={(e) => handleCreate(e, i)}
                    options={productList}
                    value={item}
                  />
                </TableCell>
                <TableCell className='pl-0 pr-4 py-3'>
                  <Input
                    value={item.type}
                    onChange={(e) => {
                      const newCopy = _.cloneDeep(productList);
                      newCopy[i].type = e.target.value;
                      setProductList(newCopy);
                    }}
                    className='bg-gray-100'
                  />
                </TableCell>
                <TableCell className='w-12 pl-0 pr-4 py-3'>
                  <Input
                    value={item.quantity}
                    onChange={(e) => {
                      const newCopy = _.cloneDeep(productList);
                      newCopy[i].quantity = e.target.value;
                      setProductList(newCopy);
                    }}
                    className='bg-gray-100'
                  />
                </TableCell>
                <TableCell className='pl-0 pr-4 py-3'>
                  <Input
                    value={item.functionalUnit}
                    onChange={(e) => {
                      const newCopy = _.cloneDeep(productList);
                      newCopy[i].functionalUnit = e.target.value;
                      setProductList(newCopy);
                    }}
                    className='bg-gray-100'
                  />
                </TableCell>
                <TableCell className='pl-0 pr-4 py-3'>
                  <Input
                    value={item.scope_3Contribution}
                    onChange={(e) => {
                      const newCopy = _.cloneDeep(productList);
                      newCopy[i].scope_3Contribution = e.target.value;
                      setProductList(newCopy);
                    }}
                    className='bg-gray-100'
                  />
                </TableCell>
                <TableCell className='pl-0 pr-4 py-3'>
                  {productList.length - 1 == i ? (
                    <Plus
                      size={16}
                      role='button'
                      onClick={() => {
                        const newCopy = _.cloneDeep(productList);
                        newCopy.push({
                          name: '',
                          type: '',
                          quantity: '',
                          functionalUnit: '',
                          scope_3Contribution: '',
                        });

                        setProductList(newCopy);
                      }}
                    />
                  ) : (
                    <X
                      size={16}
                      role='button'
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

        <div
          role='button'
          onClick={() => {
            const data: any = {
              supplierId: supplier?.data?.id,
              supplierProducts: productList,
            };
            addSupplierProductsMut(data);
          }}
          className='justify-center self-end px-4 py-2 mt-6 text-sm font-semibold leading-4 text-center text-blue-600 whitespace-nowrap rounded border-2 border-solid aspect-[2.03] border-[color:var(--Accent-colors-Sparkle---Active,#2C75D3)]'
        >
          Save
        </div>
      </div>
    </div>
  );
};
export default AddSupplierManualy;
