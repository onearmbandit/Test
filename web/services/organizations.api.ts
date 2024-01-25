"use server";

import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Options = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: any;
  headers?: AxiosHeaders;
};

const fetchApi = async (
  url: string,
  options = { method: "GET" } as Options
) => {
  const { headers, method, body } = options;

  // const session = await getServerSession(authOptions);
  // const token = session?.user;

  const token =
    "MQ.-PGntsVnmoJ9aSfLxCbKxcQlJSStDUJj-91Poz4_CmjqmHE9nv911EFRVINj";
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

export const setupOrganizationStep1 = ({
  id,
  formdata,
}: {
  id: string;
  formdata: any;
}): any => {
  console.log("api call", formdata);

  return fetchApi(`/auth/organization/${id}`, {
    method: "PATCH",
    body: formdata,
    headers: {
      "Content-Type": "application/json",
    } as RawAxiosRequestHeaders,
  } as Options);
};

export const setupOrganizationStep2 = ({
  id,
  formdata,
}: {
  id: string;
  formdata: any;
}): any => {
  console.log("api call", formdata);

  return fetchApi(`/auth/organization/${id}`, {
    method: "PATCH",
    body: formdata,
    headers: {
      "Content-Type": "application/json",
    } as RawAxiosRequestHeaders,
  } as Options);
};

export const setupOrganizationStep3 = ({
  id,
  formdata,
}: {
  id: string;
  formdata: any;
}) => {
  console.log("api call", formdata);

  return fetchApi(`/auth/organization/${id}`, {
    method: "PATCH",
    body: formdata,
    headers: {
      "Content-Type": "application/json",
    } as RawAxiosRequestHeaders,
  } as Options);
};


export const setupOrganizationStep4 = ({
  id,
  formdata,
}: {
  id: string;
  formdata: any;
}) => {
  const formbody = new URLSearchParams(formdata).toString();

  return fetchApi(`/auth/organization/${id}`, {
    method: "PATCH",
    body: formbody,
    headers: {
      "Content-Type": "application/json",
    } as RawAxiosRequestHeaders,
  } as Options);
};
