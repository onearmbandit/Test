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

export const editAbatementProjects = ({
  id,
  obj,
}: {
  id: string;
  obj: any;
}) => {
  return fetchApi(`/auth/abatement-projects/${id}`, {
    method: "PATCH",
    body: obj,
  });
};

export const getActiveAbatementProjects = (orgId: string) => {
  if (orgId) {
    return fetchApi(
      `/auth/abatement-projects?organizationId=${orgId}&filters[status]=1`
    );
  }
};

export const getActiveAbatementProjectById = (projectId: string) => {
  return fetchApi(`/auth/abatement-projects/${projectId}`);
};

export const getCompletedAbatementProjects = (orgId: string) => {
  return fetchApi(
    `/auth/abatement-projects?organizationId=${orgId}&filters[status]=2`
  );
};
export const getProposedAbatementProjects = (orgId: string) => {
  return fetchApi(
    `/auth/abatement-projects?organizationId=${orgId}&filters[status]=0`
  );
};

export const getSupplierOrganization = (orgId: string) => {
  return fetchApi(
    `/auth/supplier-organizations?order=desc&include=supplier,organization&organizationId=${orgId}`
  );
};

export const deleteAbatementProject = (projectId: string) => {
  return fetchApi(`/auth/abatement-projects/${projectId}`, {
    method: "DELETE",
  });
};
