'use server';

import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios';
// import { authOptions } from '@/lib/utils';
// import { getServerSession } from 'next-auth';
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
  const token =
    'OQ.aGk2BbPD6TM1Qd60sG5IZUBJIxV1-M8KxnYOxqcpss0S1a9gfROPcjrnWGZT';
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
      // console.log(err.response.data);
      throw new Error(err.response.data.message);
    });

  return response;
};
export const importFile = (data: any) => {
  const formbody = data;
  console.log(data, 'formData');

  return fetchApi('/auth/suppliers/csv-upload', {
    method: 'POST',
    body: formbody,
  });
};
export const addReportingPeriod = (data: any) => {
  const formbody = data;
  console.log(data, 'formData');

  return fetchApi('auth/supplier-period', {
    method: 'POST',
    body: formbody,
  });
};
export const downloadCsvTemplate = () => {
  return fetchApi('/download-supplier-csv', {
    method: 'GET',
  });
};
