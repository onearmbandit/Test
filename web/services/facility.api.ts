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
      throw new Error(err.response?.data.message);
    });

  return response;
};

export const createFacility = (obj: any) => {
  return fetchApi("/auth/facility", { method: "POST", body: obj });
};

export const getFacilities = async () => {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizations[0].id;
  return fetchApi(`/auth/facility?organization_id=${orgId}`);
};

export const addFacilityReportingPeriod = (formData: any) => {
  return fetchApi(`/auth/facility-emission`, {
    method: "POST",
    body: formData,
  });
};

export const editFacilityReportingPeriod = ({ id, formData }: any) => {
  console.log(id, formData);
  return fetchApi(`/auth/facility-emission/${id}`, {
    method: "PATCH",
    body: formData,
  });
};

export const deleteFacilityReportingPeriod = (id: string) => {
  return fetchApi(`/auth/facility-emission/${id}`, {
    method: "DELETE",
  });
};

export const getReportingPeriodById = (periodId: string) => {
  return fetchApi(`/auth/facility-emission/${periodId}`);
};

export const getReportingPeriods = (facilityId: string) => {
  return fetchApi(
    `/auth/facility-emission?per_page=10&page=1&organization_facility_id=${facilityId}`
  );
};

export const addScopeEmissions = ({ id, obj }: any) => {
  return fetchApi(`/auth/facility-emission/${id}`, {
    method: "PATCH",
    body: obj,
  });
};
