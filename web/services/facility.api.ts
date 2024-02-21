"use server";

import { authOptions } from "@/lib/utils";
import axios, { AxiosHeaders } from "axios";
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

export const createFacility = (obj: any) => {
  return fetchApi("/auth/facility", { method: "POST", body: obj });
};

export const updateFacility = ({ id, obj }: { id: string; obj: any }) => {
  return fetchApi(`/auth/facility/${id}`, { method: "PATCH", body: obj });
};

export const getFacilities = async () => {
  const session = await getServerSession(authOptions);
  const orgId = session?.user?.organizations[0]?.id;
  return fetchApi(
    `/auth/facility?organization_id=${orgId}&include=facilityEmission`
  );
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

export const addProductLines = (formData: any) => {
  return fetchApi(`/auth/facility-product`, { method: "POST", body: formData });
};

export const editProductLines = (formData: any) => {
  return fetchApi(`/auth/update-facility-products`, {
    method: "POST",
    body: formData,
  });
};

export const getProductLines = (emissionId: string) => {
  return fetchApi(`/auth/facility-emission/${emissionId}`);
};

export const getProductLineEmissions = (emissionId: string) => {
  return fetchApi(`/auth/facility-product?facilityEmissionId=${emissionId}`);
};

export const updateProductEmissions = ({
  id,
  obj,
}: {
  id: string;
  obj: any;
}) => {
  return fetchApi(`/auth/facility-emission/${id}`, {
    method: "PATCH",
    body: obj,
  });
};

export const facilityDetails = (id: string) => {
  return fetchApi(`/auth/facility/${id}`);
};

export const getEqualityData = (id: string) => {
  return fetchApi(
    `/auth/equality-emission-calculation?facilityEmissionId=${id}`
  );
};

export const getFacilityDashboard = ({
  from = "",
  to = "",
}: {
  from?: string;
  to?: string;
}) => {
  return fetchApi(
    `/auth/dashboard-data?reportingPeriodFrom=${from}&reportingPeriodTo=${to}`
  );
};

export const getAllFacilityProductNames = (orgId: string) => {
  return fetchApi(
    `/auth/facility-product-name-list?organizationId=${orgId}&order=asc`
  );
};

export const getDashboardReportingPeriodList = (orgId: string) => {
  return fetchApi(`/auth/facility-emission?organization_id=${orgId}`);
};
