'use server';
import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';

import { authOptions } from '@/lib/utils';
import { getServerSession } from 'next-auth';
type CreateAPIMethod = <TInput extends Record<string, string>, TOutput>(opts: {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT';
}) => (input: TInput) => Promise<TOutput>;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Options = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: any;
  headers?: AxiosHeaders;
};

const fetchApi = async (
  url: string,
  options = { method: 'GET' } as Options
) => {
  const { headers, method, body } = options;
  // const session = await getServerSession(authOptions);
  const session = await getServerSession(authOptions);
  const token = session?.token.token;
  console.log(token, 'token');
  const authHeader = {
    Authorization: `bearer ${token}`,
  };
  const response = await axios({
    url: `${BASE_URL}/api/v1${url}`,
    method: method,
    headers: { ...headers, ...authHeader },
    data: body,
  })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err.response.data, 'error');
      return err.response.data;
    });

  return response;
};
export const importFile = (data: any) => {
  const formbody = data;
  return fetchApi('/auth/supplier-csv-upload', {
    method: 'POST',
    body: formbody,
  });
};
export const addReportingPeriod = (data: any) => {
  const formbody = data;
  return fetchApi('/auth/supplier-period', {
    method: 'POST',
    body: formbody,
  });
};
export const getAllReportingPeriods = (organizationId: string) => {
  console.log(organizationId, 'organizationId');
  return fetchApi(
    `/auth/supplier-period?page=1&per_page=10&organizationId=${organizationId}`
  );
};
export const editReportingPerid = ({ id, formData }: any) => {
  const formbody = formData;
  return fetchApi(`/auth/supplier-period/${id}`, {
    method: 'PATCH',
    body: formbody,
  });
};
export const deleteReportingPerid = (id: string) => {
  return fetchApi(`/auth/supplier-period/${id}`, {
    method: 'DELETE',
  });
};
export const downloadCsvTemplate = () => {
  return fetchApi('/download-supplier-csv', {
    method: 'GET',
  });
};

export const getReportingPeriodById = (id: string) => {
  return fetchApi(`/auth/supplier-period/${id}`, {
    method: 'GET',
  });
};

// add supplier manually
export const addSupplier = (data: any) => {
  const formbody = data;
  return fetchApi('/auth/suppliers', {
    method: 'POST',
    body: formbody,
  });
};

//update supplier
export const updateSupplier = (data: any) => {
  const formbody = data;
  return fetchApi(`/auth/suppliers/${data.id}`, {
    method: 'PATCH',
    body: formbody,
  });
};
export const getAllEmissioScopeData = (id: string) => {
  return fetchApi(
    `/auth/supplier-period-emission?supplyChainReportingPeriodId=${id}`,
    {
      method: 'GET',
    }
  );
};

export const getProductNamesBySupplierId = (id: string) => {
  return fetchApi(`/auth/supplier-product-name?supplierId=${id}`, {
    method: 'GET',
  });
};

export const getProductTypesBySupplierId = (id: string) => {
  return fetchApi(`/auth/supplier-product-type?supplierId=${id}`, {
    method: 'GET',
  });
};

export const createSupplierProduct = (data: any) => {
  return fetchApi('/auth/supplier-products', {
    method: 'POST',
    body: data,
  });
};

export const getAllSuppliersByPeriodId = (periodId: string | undefined) => {
  if (periodId) {
    return fetchApi(
      `/auth/supplier-products?supplyChainReportingPeriodId=${periodId}`,
      {
        method: 'GET',
      }
    );
  }
};

export const deleteMultipleSupplierProducts = (ids: any): any => {
  return fetchApi(`/auth/remove-multiple-products`, {
    method: 'POST',
    body: { products: ids },
  });
};

export const getSupplierDetailsById = (supplierId: string) => {
  return fetchApi(`/auth/suppliers/${supplierId}`);
};
export const exportSuppliersDataCsv = async ({
  organizationId,
  supplyChainReportingPeriodId,
}: {
  organizationId: string | undefined;
  supplyChainReportingPeriodId: string | undefined;
}) => {
  'use server';
  const session = await getServerSession(authOptions);
  console.log(organizationId, 'organizationId');
  console.log(supplyChainReportingPeriodId, 'supplyChainReportingPeriodId');
  const token: any = session?.token.token;
  const authHeader = {
    Authorization: `bearer ${token}`,
  };

  const response = await axios({
    url: `${BASE_URL}/api/v1/auth/export-supplier-data?organizationId=${organizationId}&supplyChainReportingPeriodId=${supplyChainReportingPeriodId}`,
    method: 'GET',
    headers: { ...authHeader },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err, 'errror');
      throw new Error(err);
    });

  // console.log("response:", response);

  return response;
};
