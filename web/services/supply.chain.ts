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
      throw new Error(err.response.data.message);
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