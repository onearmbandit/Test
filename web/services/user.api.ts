"use server";

import { authOptions } from "@/lib/utils";
import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { getServerSession } from "next-auth";
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

  const session = await getServerSession(authOptions);

  const token: any = session?.token.token;
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
      // console.log(err.response.data.errors[0].message);
      throw new Error(err.response.data.errors[0].message);
    });

  return response;
};

export const getUser = () => {
  return fetchApi("/auth/user");
};

export const updatePassword = ({ formBody }: { formBody: any }) => {
  return fetchApi(`/auth/user`, {
    method: "PATCH",
    body: formBody,
  } as Options);
};

export const getRoleByName = ({ roleName }: { roleName: string }) => {
  return fetchApi(`/auth/roles/${roleName}`);
};

// export const setupOrganizationStep4 = ({
//   id,
//   formdata,
// }: {
//   id: string;
//   formdata: any;
// }) => {
//   return fetchApi(`/auth/organization/${id}`, {
//     method: "PATCH",
//     body: formdata,
//   } as Options);
// };
