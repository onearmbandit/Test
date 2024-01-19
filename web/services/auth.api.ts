"use server";

import axios, { AxiosHeaders } from "axios";
type CreateAPIMethod = <TInput extends Record<string, string>, TOutput>(opts: {
  url: string;
  method: "GET" | "POST" | "PATCH" | "PUT";
}) => (input: TInput) => Promise<TOutput>;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type Options = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body: any;
  headers: AxiosHeaders;
};

const fetchApi = async (
  url: string,
  options = { method: "GET" } as Options
) => {
  const { headers, method, body } = options;
  console.log(options.body);

  const response = await axios({
    url: `${BASE_URL}/api/v1${url}`,
    method: method,
    // headers: headers,
    data: body,
  })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err.response.data);
      throw new Error(err.response.data.message);
    });

  return response;
};

export const register = (user: any) => {
  // console.log("user", user);
  return fetchApi("/register", { method: "POST", body: user } as Options);
};

export const registerStep2 = (id: number, formdata: any) => {
  return fetchApi(`/user/${id}`, {
    method: "PATCH",
    body: formdata,
  } as Options);
};
