"use server";

import { authOptions } from "@/lib/utils";
import axios, { AxiosHeaders } from "axios";
import { forEach } from "lodash";
import { getServerSession } from "next-auth";

type Options = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: any;
  headers?: AxiosHeaders;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchApi = async (
  url: string,
  options = { method: "GET" } as Options
) => {
  const { headers, method, body } = options;

  const session = await getServerSession(authOptions);
  const token = session?.token.token;
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
      console.log(err.response.data);
      return err.response?.data;
    });

  return response;
};

export const addAbatementProjects = (obj: any) => {
  return fetchApi("/auth/abatement-projects", { method: "POST", body: obj });
};

export const getActiveAbatementProjects = (orgId: string) => {
  return fetchApi(`/auth/abatement-projects?organizationId=${orgId}`);
};

export const getActiveAbatementProjectById = (projectId: string) => {
  return fetchApi(`/auth/abatement-projects/${projectId}`);
};
