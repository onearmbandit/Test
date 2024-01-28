"use server";

import { authOptions } from "@/lib/utils";
import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { getServerSession } from "next-auth";
type CreateAPIMethod = <TInput extends Record<string, string>, TOutput>(opts: {
  url: string;
  method: "GET" | "POST" | "PATCH" | "PUT";
}) => (input: TInput) => Promise<TOutput>;

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
  // const authHeader = {
  //   Authorization: `bearer ${token}`,
  // };

  const response = await axios({
    url: `${BASE_URL}/api/v1${url}`,
    method: method,
    headers: headers,
    data: body,
  })
    .then((res) => res.data)
    .catch((err) => {
      // console.log(err.response.data);
      throw new Error(err.response.data.message);
    });

  return response;
};

export const register = (user: any) => {
  // console.log("user", user);
  return fetchApi("/register", { method: "POST", body: user } as Options);
};

export const registerStep2 = ({
  id,
  formdata,
}: {
  id: number;
  formdata: any;
}) => {
  const formbody = new URLSearchParams(formdata).toString();

  return fetchApi(`/user/${id}`, {
    method: "PATCH",
    body: formbody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    } as RawAxiosRequestHeaders,
  } as Options);
};

export const registerOrganisation = (orgBody: any) => {
  return fetchApi("/organization", { method: "POST", body: orgBody });
};

export const login = (body: any) => {
  const formbody = new FormData();
  formbody.append("email", body.email);
  formbody.append("password", body.password);

  return fetchApi("/login", { method: "POST", body: formbody });
};

export const forgotPassword = (body: any) => {
  const formBody = new FormData();
  formBody.append("email", body.email);
  return fetchApi("/forgot-password", { method: "POST", body: formBody });
};

export const resetPassword = (body: any) => {
  return fetchApi("/reset-password", { method: "POST", body });
};
